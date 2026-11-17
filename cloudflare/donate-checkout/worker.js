// Blue Card donation checkout (Cloudflare Worker)
//
// The donate page at https://bluecard.org/donate/ POSTs { amount, monthly } here.
// This Worker creates a Stripe Checkout Session in the "bluecardfund.org (Apple Pay)"
// Stripe account and returns its URL. Stripe's hosted checkout shows Apple Pay,
// Google Pay and card automatically.
//
// Secret (set in Cloudflare, never in this file):
//   STRIPE_SECRET_KEY  restricted key from that Stripe account, "Checkout Sessions: Write"
// Plain vars (wrangler.toml):
//   ALLOWED_ORIGINS    comma-separated origins allowed to call this Worker
//   STRIPE_PRODUCT_ID  product the donations are recorded under
//   SITE_URL           where Stripe sends donors back to

const MIN_CENTS = 100;        // $1
const MAX_CENTS = 2500000;    // $25,000

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const cors = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' }
      : {};

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' },
      });
    }
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);
    if (!cors['Access-Control-Allow-Origin']) return json({ error: 'Origin not allowed' }, 403, cors);
    if (!env.STRIPE_SECRET_KEY) return json({ error: 'Donations are temporarily unavailable' }, 503, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400, cors); }

    const cents = Math.round(Number(body.amount) * 100);
    if (!Number.isFinite(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
      return json({ error: 'Please enter an amount between $1 and $25,000.' }, 400, cors);
    }
    const monthly = body.monthly === true;
    const site = (env.SITE_URL || 'https://bluecard.org').replace(/\/+$/, '');

    const p = new URLSearchParams();
    p.set('mode', monthly ? 'subscription' : 'payment');
    p.set('line_items[0][quantity]', '1');
    p.set('line_items[0][price_data][currency]', 'usd');
    p.set('line_items[0][price_data][product]', env.STRIPE_PRODUCT_ID);
    p.set('line_items[0][price_data][unit_amount]', String(cents));
    if (monthly) {
      p.set('line_items[0][price_data][recurring][interval]', 'month');
      p.set('subscription_data[metadata][source]', 'bluecard.org/donate');
    } else {
      p.set('submit_type', 'donate');
      p.set('customer_creation', 'always');
      p.set('payment_intent_data[metadata][source]', 'bluecard.org/donate');
    }
    p.set('metadata[source]', 'bluecard.org/donate');
    p.set('billing_address_collection', 'auto');
    p.set('success_url', site + '/donate/thank-you/?session_id={CHECKOUT_SESSION_ID}');
    p.set('cancel_url', site + '/donate/#apple-pay');

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.STRIPE_SECRET_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2024-06-20',
      },
      body: p,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      console.log('stripe error', res.status, data && data.error && data.error.message);
      return json({ error: 'We could not start checkout. Please try again.' }, 502, cors);
    }
    return json({ url: data.url }, 200, cors);
  },
};

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}
