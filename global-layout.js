(function () {
  var baseScript = document.createElement('script');
  baseScript.src = '/bluecard/global-layout-base.js?v=20260804-2';
  baseScript.onload = function () {
    var homepageScript = document.createElement('script');
    homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260804-2';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);
})();
