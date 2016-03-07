/**
 * Modern Shared Components: JS Utilities Library
 * @name modern-formatting-date
 * @contrib Rajesh
 * @version 1.0.0
 */
define(function() {

  // Component
  return {

    /**
     * Format a date according to specs
     * @function
     * @param {string} dateString - date to be formatted
     * @param {string} format - format template:
     *   Year: yyyy = 4 digit, yy = 2 digit
     *   Month: MMMM = full name, MMM = abbrev, mm = padded, m = unpadded
     *   Day of Week: WWWW = full name, WWW = abbrev
     *   Day of Month: dd =  padded, d = unpadded, o = ordinal
     *   Hour: HH = 24hr padded, H = 24hr unpadded, hh = 12hr padded, h = 12hr unpadded
     *   Minute: nn = padded, n = unpadded
     *   Second: ss = padded, s = unpadded
     *   AM/PM: A = uppercase, a = lowercase
     *   [xxx]: escaped text
     *   debug: echos all possible parameters
     */
    format: function(dateString, format) {
      var date = dateString ? new Date(dateString) : new Date();
      if (isNaN(date)) return false;
      if (!format) return date.toLocaleString();
      if (format==='debug') format = "[Year:](yyyy|yy) [Month:](MMMM|MMM|mm|m) [DOW:](WWWW|WWW) [Day:](dd|d|o) [Hour:](hh|h|HH|H) [Minute:](nn|n) [Second:](ss|s) [AM/PM:](A|a)";
      var months = ["","January","February","March","April","May","June","July","August","September","October","November","December"],
        dows = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        ords = ["th","st","nd","rd"],
        yyyy = date.getFullYear(),
        m = date.getMonth() + 1,
        w = date.getDay(),
        d = date.getDate(),
        H = date.getHours(),
        h = (H>12 ? H-12 : (H===0 ? 12 : H)),
        n = date.getMinutes(),
        s = date.getSeconds(),
        ap = (H>11 ? 'PM' : 'AM'),
        dateParts = {
          save: 1,
          yyyy: yyyy, yy: yyyy.toString().substr(-2),
          MMMM: months[m], MMM: months[m].substring(0,3), mm: ("0" + m).substr(-2), m: m,
          WWWW: dows[w], WWW: dows[w].substring(0,3),
          dd: ("0" + d).substr(-2), d: d,
          o: d + ords[d>3?0:d],
          hh: ("0" + h).substr(-2), h: h,
          HH: ("0" + H).substr(-2), H: H,
          nn: ("0" + n).substr(-2), n: n,
          ss: ("0" + s).substr(-2), s: s,
          A: ap, a: ap.toLowerCase()
        },
        save = [],
        ct = 0;
      // Save protected values and collect replacement values
      for (var p in dateParts) {
        if (dateParts.hasOwnProperty(p)) {
          format = format.replace((p==='save' ? /\[[^\]]+\]/g : p), function(m){
            save.push(p==='save' ? m.replace(/[\[\]]/g,'') : dateParts[p]);
            return '~' + (ct++) + '~';
          });
        }
      }
      // Do final replacements
      format = format.replace(/\~(\d+)\~/g, function(m,d){ return save[parseInt(d)]; });
      // Return
      return format;
    },

    /**
     * Convert date from ISO-8601 yyyy-mm-dd to mm.dd.yy
     * @function
     * @param {string} dateString - date to be formatted
     * @param {string} format - format to use. Default: mm.dd.yyyy
     * @param {boolean} isGMT - indicates GMT time. Default: false
     */
    formatISO8601toMMDDYY: function(dateString,format,isGMT) {
      // Note that standard ISO-8601 is GMT, so using regex to rearrange first
      if (!isGMT) dateString = dateString.replace(/^(\d{2,4})-(\d{1,2})-(\d{1,2}).*$/,'$2/$3/$1');
      format = format || 'mm.dd.yyyy';
      return this.format(dateString,format);
    }

  }

});