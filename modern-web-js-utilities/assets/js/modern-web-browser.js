/**
 * Modern Shared Components: JS Utilities Library
 * @name modern-web-browser
 * @contrib Bob Smithwick
 * @version 1.0.0
 */
define(['modernizr'], function(Modernizr) {

  // Component
  return {

    // Media query definitions
    queries: {
      PHONE:            '(max-width: 479px)',
      PHABLET:          '(min-width: 480px) and (max-width: 767px)',
      TABLET:           '(min-width: 768px) and (max-width: 991px)',
      SMALL_DESKTOP:    '(min-width: 992px) and (max-width: 1199px)',
      LARGE_DESKTOP:    '(min-width: 1200px)',
      PORTRAIT:         '(orientation: portrait)',
      LANDSCAPE:        '(orientation: landscape)',
      PRINT:            'print'
    },

    // Public Methods
    isPhone:            function(){ return Modernizr.mq(this.queries.PHONE) },
    isPhablet:          function(){ return Modernizr.mq(this.queries.PHABLET) },
    isTablet:           function(){ return Modernizr.mq(this.queries.TABLET) },
    isSmallDesktop:     function(){ return Modernizr.mq(this.queries.SMALL_DESKTOP) },
    isLargeDesktop:     function(){ return Modernizr.mq(this.queries.LARGE_DESKTOP) },
    isPortrait:         function(){ return Modernizr.mq(this.queries.PORTRAIT) },
    isLandscape:        function(){ return Modernizr.mq(this.queries.LANDSCAPE) },
    isPrint:            function(){ return Modernizr.mq(this.queries.PRINT) }

  };

});