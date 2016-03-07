// Flag when loaded
(function(){
  $(function(){
    $(window).load(function(){ this._loaded=true })
  });
})(jQuery);

// For header files
// Sets up variables so they may be requested without reloading
// Also shims the ones needing shimming
define('jquery', function(){
  return jQuery;
});
define('modernizr', (function (global) {
  return function () {
    return global.Modernizr;
  };
}(this)));
define('picturefill', (function (global) {
  return function () {
    return global.matchMedia;
  };
}(this)));

// Load all libraries
require([
  'utilities/modern',
  'modernizr',
  'jquery',
  'attachJQ',
  'form-search',
  'linkList',
  'f2'
  ], function(
    utilities,
    modernizr,
    jquery,
    attachJQ,
    searchForm,
    linkList,
    f2
  ) {

    // Make javascript available everywhere
    window.tiaa = utilities;
    window.F2 = window.F2_instance = f2;

    // Attach functions
    var $window = $(window);
    var $document = $(document);
    var $body = $('body');


    // Attach regular components to DOM elements
    // This may be called again if code injection happens
    function attachJQComponents(){
      $('.search-form-component').attachJQ(searchForm,'searchForm');
						$('.link-list ul').attachJQ(linkList, 'linkList');
    }
    attachJQComponents();

    // When code is injected into a modal or document, attach new items
    $document.on('loaded.bs.modal', '.modal', function(e) {

      setTimeout(function(){
        $window.trigger('loaded');
      },100);
    }).on('loaded.jscommon', function(e){
      attachJQComponents();
      setTimeout(function(){
        $window.trigger('loaded');
        $(this).triggerAnimation();
      },400);
    });

    // Fire any functions that need a window.load event
    // Because of how require.js works, window.load may have
    // already fired, so this makes sure those setup steps
    // can happen
    function loadReady() {
      $window.trigger('loaded');
    }
    if (window._loaded) loadReady();
    else $(window).load(loadReady);

  }
);