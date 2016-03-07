/**
 * Modern Shared Components: JS Utilities Library
 * @name modern-web
 * @contrib Rajesh
 * @version 1.0.0
 */
define(['utilities/modern-web-ajax', 'utilities/modern-web-browser', 'utilities/modern-web-cookie', 'utilities/modern-web-url'],
  function(_ajax, _browser, _cookie, _url) {

     // Component
    return {

      // Classes
      ajax: _ajax,
      browser: _browser,
      cookie: _cookie,
      url: _url

      // Properties

      // Methods

    };

  }
);