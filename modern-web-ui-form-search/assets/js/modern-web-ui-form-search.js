/**
 * Modern Shared Components: Search Form
 * @requires jquery
 * @return SearchForm
 * @contrib Rajesh
 * @version 1.0.0
 */
define(['jquery'], function($) {

  // Constructor
  var SearchForm = {

    // Defaults
    defaults: {
      formSelector:                   '.form-component form',                         // Component selector
      formSearchSelector:             '.form-control',                                // Search field
					 resultSecSelector:             '.sf-results .ll-ul',

    },

    // Initialize
    init: function(elem, options, i) {
      var my = this;
      var timeout;
      my.options = $.extend({}, my.defaults, options);

      // References
      my.$window = $(window);
      my.$elem = $(elem);
      my.$form = my.$elem.find(my.options.formSelector);
      my.$formSearch = my.$form.find(my.options.formSearchSelector);
						my.$resultsDS = my.$elem.find(my.options.resultSecSelector);

      // Activate
      my.activate();
    },

    // Activate
    activate: function() {
      var my = this;
      my._addEventHandlers();
      my.$window = $(window);

    },

    // Add handlers
    _addEventHandlers: function() {
      var my = this;
						my._addSubmitHandler()
    },
				
				// TEMPORARY. When searching, take over the default submit process
    // and get results
    _addSubmitHandler: function() {
      var my = this;
      // If form should be shown, cancel submission
      my.$form.on('submit.searchform' + my.ind, function(e) {
        e.preventDefault();
        var query = encodeURIComponent($.trim(my.$formSearch.val()));
        if (!query) return;
							 my.$resultsDS.linkList().loadMore(true);
      });
    },
				
				// Deactivate
    deactivate: function() {
      var my = this;
      my._removeEventHandlers();
    },

    // Remove handlers
    _removeEventHandlers: function() {
      var my = this;
      my.$form.off('submit.searchform' + my.ind);
      //my.$formFilter.off('change.searchform' + my.ind);
    }
  };

  // Return
  return SearchForm;

});
