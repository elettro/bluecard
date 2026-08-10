(function () {
  var cacheBust = Date.now();
  var legacyScript = document.createElement('script');
  legacyScript.src = '/bluecard/global-layout-legacy.js?v=' + cacheBust;
  legacyScript.onload = function () {
    var bbbPatch = document.createElement('script');
    bbbPatch.src = '/bluecard/bbb-footer.js?v=' + cacheBust;
    document.body.appendChild(bbbPatch);
  };
  document.head.appendChild(legacyScript);
})();
