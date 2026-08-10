(function () {
  var legacyScript = document.createElement('script');
  legacyScript.src = '/bluecard/global-layout-legacy.js?v=20260810-bbb1';
  legacyScript.onload = function () {
    var bbbPatch = document.createElement('script');
    bbbPatch.src = '/bluecard/bbb-footer.js?v=20260810-bbb1';
    document.body.appendChild(bbbPatch);
  };
  document.head.appendChild(legacyScript);
})();
