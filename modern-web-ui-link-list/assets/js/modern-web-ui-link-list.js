/**
 * Modern Shared Components: Linklist
 * @requires jquery
 * @return Linklist
 * @contrib Rajesh babu
 * @version 1.0.0
 */
define(['jquery', 'Handlebars'], function($, Handlebars) {

  // Constructor
  var Linklist = {

    //defaults
    defaults: {
      lazySourceAttr:           'data-source',
      lazyNumAttr:              'data-lazy',
      mobileNumAttr:            'data-mobilecount',
      lazyTemplateSelector:     '#link-list-template',             // Identifies tag used to hold lazy load template
      id:                       'id',
      linkListSelector:         '.link-list',
      previousLinkSelector:     'li.pages-previous a',
      nextLinkSelector:         'li.pages-next a',
      nextPrevColorDisbledCls:  'disabled',
      mobileMenuSelector:       '#mobile-menu-main',
      mobScrollAreaSelector:    '#mobile-menu-main .menu-scroll-area',
      resultsSecSelector:       '.sf-results',
      resultsFilterSecSelector: '.sf-has-filter',
      resultsheadingSelector:   '.gh-heading',
      resultsDescSelector:      '.gh-description',
      filterHeadingsSelector:   '.filter-group',
      filterOptionsSelector:    '.filter-group .list-unstyled li',
      noResultSuggestComponent: '.noResultSuggestComponent',
      resultsTitleSelector:     '.group-heading .gh-eyebrow',
      titleAttr:                'data-results',
      headingAttr:              'data-result',
      allListId:                'al',
      menuSelector:             '.menu',
      navbarSelector:           '.navbar',
      qryStrName:               'qryStr',
      f2_root:                  'root',
      f2_render:                'render',
      hideCls:                  'hide',
      QString:                  'QString'
    },

    init: function(elem, options, i) {
      var my = this;
      my.options = $.extend({}, my.defaults, options);

      //References
      my.ind = i;
      my.$elem = $(elem);
      my.$window = $(window);

      //Activate on load
      my.$window.one('loaded', function llWindowLoad() {
          // Get and compile lazy load template - swap escaped brackets
          var html = my.$elem.find(my.options.lazyTemplateSelector).html()
            .replace(/\(\(\(/g, '{{{').replace(/\(\(/g, '{{')
            .replace(/\)\)\)/g, '}}}').replace(/\)\)/g, '}}');
          my.lazyTemplate = Handlebars.compile(html);
          my.id = my.$elem.attr(my.options.id);
          // Activate
          my.activate.call(my);
        
      });
    },

    activate: function() {
      var my = this;

    },

    loadMore: function(clearResults) {
      var my = this;

      // If clearing results
      if (clearResults) {
        my.lazyItems = [];
        my.$elem.find('li').remove();
      }
						my.lazyDisabled = true;
						my.dataSource = my.$elem.attr(my.options.lazySourceAttr); // Get the data-source value again in order to get the user's search string

						$.ajax({
								dataType: 'json',
								url: my.dataSource,
								success: function(data) {
										my.$elem.html(my.lazyTemplate(data));
										my.$elem.closest(".sf-results").removeClass("hide");
								}
						}).fail(tiaa.web.ajax.onAjaxError);
    }

  };

  //return
  return Linklist;
});