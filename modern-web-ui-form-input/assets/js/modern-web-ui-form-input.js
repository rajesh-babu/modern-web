/**
* Modern Shared Components: Form Input
* @requires jquery
* @return InputField
* @contrib Rajesh
* @version 1.0.0
*/
define(['jquery'], function($) {
  // Constructor
  var InputField = {

    // Defaults
    defaults: {
      formClearSelector:          '.btn-clear',                 // Clear button
      autoCompleteSelector:       '.autocomplete',              // Autocomplete
      toggleVisibilitySelector:   '.btn-toggle-visibility',     // Used with password fields
      toggleOnAttribute:          'toggle-on',                  // Attribute that defines show password text
      toggleOnAriaAttribute:      'toggle-on-aria',             // Attribute that defines show password aria label
      toggleOffAttribute:         'toggle-off',                 // Attribute that defines hide password text
      toggleOffAriaAttribute:     'toggle-off-aria',            // Attribute that defines hide password aria label
      dataSourceAttribute:        'datasource',                 // Datasource for autocomplete
      searchResultsElement:       '.ac-results',                // Class to identify autocomplete results
      searchResultsClass:         'search-icon',                // Class to identify if search icon is required in autocomplete results
      searchResultsIcon:          'icon-search',                // search icon class in autocomplete results
      minLenAttribute:            'minlen',                     // Attribute to fetch minimum length of autocomplete
      minLengthAc:                1,                            // Default minimum length of autocomplete
      ixInputClass:               'ix-input',                   // IX-Input style class
      customAutoSuggSelector:     '.customAutoSuggest',
      customAutoSuggDtAttr:       'data-autosuggest',
      searchFormSelector:         '.search-form-component',
      qryStrName:                 'qryStr'
    },

    // Initialize
    init: function(elem, options, i) {
      var my = this;
      var timeout;
      my.options = $.extend({},my.defaults,options);
      my.ind = i;

      // References
      my.$elem = $(elem);
      my.$window = $(window);
      my.$input = my.$elem.find('input');


      // Activate
      my.activate();
    },

    // Activate
    activate: function(){
      var my = this;
      my._addHandlers();

    },

    // Add handlers
    _addHandlers: function(){
      var my = this;

    }

  };

  // Return
  return InputField;

});