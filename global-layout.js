(function () {
  var baseScript = document.createElement('script');
  baseScript.src = './global-layout-base.js?v=20260804-1';
  baseScript.onload = function () {
    var homepageScript = document.createElement('script');
    homepageScript.src = './homepage-how-we-help.js?v=20260804-1';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);
})();
