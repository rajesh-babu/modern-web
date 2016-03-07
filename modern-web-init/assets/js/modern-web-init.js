// Configure
require.config({
  baseUrl: 'modern-web-ui-core/',

  // Create shortcuts to all libraries
  paths: {

    // Vendor libraries
    'modernizr':                  'empty:', // in header 'modern-web-vendor-modernizr/assets/js/modernizr.min',
    'jquery':                     'empty:', // in header 'modern-web-vendor-jquery/assets/js/jquery.min',
    'bootstrap':                  'modern-web-vendor-bootstrap/assets/js/bootstrap',
    'bootstrap-accessibility':    'modern-web-vendor-bootstrapaccessibility/assets/js/bootstrap-accessibility.min',
    'Handlebars':                 'modern-web-vendor-handlebars/assets/js/handlebars.min',

    // Internal libraries
    'attachJQ':                   'modern-web-init/assets/js/attachJQ',
    'utilities':                  'modern-web-js-utilities/assets/js',

    // Components
    'form-search':                'modern-web-ui-form-search/assets/js/modern-web-ui-form-search',
				
    'linkList':                   'modern-web-ui-link-list/assets/js/modern-web-ui-link-list',

    'f2':                         'modern-web-f2/assets/js/modern-web-f2'
  },

  // Wrap non-AMD libraries
  shim: {
    'f2' : {deps: ['jquery'], exports :"f2"}
  },

  // Load init
  deps: [ 'modern-web-init/assets/js/load.js' ]

});
