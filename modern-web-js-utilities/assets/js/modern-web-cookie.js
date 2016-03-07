/**
 * Modern Shared Components: JS Utilities Library
 * @name modern-web-cookie
 * @contrib Rajesh
 * @version 1.0.0
 */
define(function() {

   // Component
  return {

    // Methods
    /**
     * Get Cookie
     * @function
     * @param {string} name - cookie name
     */
    getCookie: function(name,path,isExactMatch) {
      if(document.cookie.length>0) {
        var c_start=document.cookie.indexOf(name + "=");
        if (isExactMatch){
          var match = new RegExp('\\s'+ name +"=").exec(document.cookie);
          if (match && match.index !== -1){
            c_start = match.index + 1;
          }
        }
        if(c_start!=-1) {
          c_start = c_start + name.length+1;
          var c_end = document.cookie.indexOf(";",c_start);
          if(c_end==-1)
            c_end=document.cookie.length;
          return unescape(document.cookie.substring(c_start,c_end));
        }
      }
      return "";
    },

    /**
     * Set Cookie
     * @function
     * @name setCookie
     * @param {string} name - cookie name
     * @param {string} value - cookie value
     * @param {int} expiredays - expiration from today in days
     * @param {string} [optional] path
     * @param {string} [optional] domain
     * @param {boolean} [optional] secure - true or false
     */
    setCookie: function (name,value,expiredays,path,domain,secure) {
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      document.cookie = name + "=" + escape(value) +
        ((expiredays) ? "; expires=" + exdate.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    }

  }

});