/**
 * Modern Shared Components: JS Utilities Library
 * @name modern-web-ajax
 * @contrib Rajesh
 * @version 1.0.0
 */
define(function() {

   // Component
  return {

    // Methods
    /**
     * Handle ajax errors
     * @function
     * @param {object} jqXHR - XHR object
     * @param {string} textStatus - message
     * @param {object} exception - error object
     */
    onAjaxError: function(jqXHR, textStatus, exception) {
      if (jqXHR.status === 0) {
        msg = 'Not connected.\n Verify Network.';
      } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
      } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
      } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
      } else if (exception === 'timeout') {
        msg = 'Time out error.';
      } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
      } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
      }
      if (window.console) console.log(msg);
    }

  }

});