/**
 * modern Shared Components: JS Utilities Library
 * @name modern-web-url
 * @contrib Rajesh
 * @version 1.0.0
 */
define(function() {

  // Component
  return {

    // Methods

    /**
     * Parse the URL for vars
     * @function
     * @return {object} name value pairs
     */
    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.search.substring(1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },

    /**
     * Determine whether the character '?' or '&' based on existing URL while adding the query string
     * @function
     * @param {string} uri
     * @param {string} key
     * @param {string} value
     * @return {string}
     */
    updateQueryStringParameter: function(uri, key, value) {
      var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i"),
        separator = uri.indexOf('?') !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
      } else {
        return uri + separator + key + "=" + value;
      }
    }
  }

});