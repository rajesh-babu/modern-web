'use strict';

// References
var through = require('through2');
var gutil = require('gulp-util');
var mustache = require('mustache');
var extend = require('node.extend');
var fs = require('fs-extra');
var path = require('path');
var glob = require('glob')

// Constants
var PLUGIN_NAME = "gulp-mustache-components";

// Export function
module.exports = function (view, opts, partials) {
    opts = extend(true,{
      templateExtension: ".mustache",
      templatePath: "./src/html/templates/",
      partialPath: "./src/html/partials/",
      assetsFolder: 'assets',
      scriptFolder: 'assets/js/',
      assetsBuild: './build/assets',
      assetsHandler: mustacheAssetsHandler
    },opts);
    partials = partials || mustachePartial;

    // Properties
    var components = {};
    var assets = {};
    var viewError = null;

    // Handler for assets
    function mustacheAssetsHandler(basePath){

      // Copy all assets to build
      try {
        fs.copySync(path.join(basePath,opts.assetsFolder), opts.assetsBuild );
      } catch(e) {
        // Ignore
      }

      // Get all js references and add to assets collection
      assets['js'] = assets['js'] || [];
      glob.sync('*.js',{
        cwd: path.join(basePath,opts.scriptFolder),
        root: path.resolve(basePath)
      }).map(function(name){
        assets['js'].push(path.join(opts.scriptFolder,name).replace(/\\/g, '/'));
      });

    }

    // Handler for mustache partials
    function mustachePartial(name){
        if (!components[name]) {
          components[name] = fs.readFileSync(path.join(opts.partialPath,name+opts.templateExtension));
        }
        var partialView = mustacheComponent(view[name]);
        partialView = extend(true,partialView,assets);
        return mustache.render(components[name].toString(), partialView, partials);
    }

    // Create data for mustache
    // Needs attribute data plus handlers for components
    function mustacheComponent(config){

      // Get the object type and return if not object/array
      var objType = typeof config;
      if (objType !== 'object') return config;

      // If object
      if (config === null) return;
      if (config.hasOwnProperty('value')) return mustacheComponent(config.value);

      // If this is a component
      var _type = config._type || '';
      if (_type) {

        // Check to see if already loaded
        var component;
        if (!components[_type]) {

          // Get it
									//delete require.cache[require.resolve("../" + _type)];
          var pkg = require("../" + _type)();
										
										delete require.cache[require.resolve("../" + _type+"/package.json")];
										var pkgJSON = require("../" + _type+"/package.json");
          component = pkgJSON.component;
          // Remove null attributes
          for (var attr in component.attributes) {
            attrConfig = component.attributes[attr];
												
            if (attrConfig.hasOwnProperty('value') && attrConfig.value === null) {
              delete component.attributes[attr];
            }
          }

          // Handle assets
          opts.assetsHandler.call(config,pkg.path);

          // load mustache template
          component._template = "";
          var templateFile = component.templates && component.templates.mustache || '';
          if (templateFile) {
            try {
              component._template = fs.readFileSync(path.join(pkg.path,templateFile));
            } catch (e) {
              new gutil.PluginError(PLUGIN_NAME, 'Unable to load template');
            }
          }

          // Add component to registry
          components[_type] = component;

        // Otherwise, use existing
        } else component = components[_type];

        // Get component properties, add custom configuration
        var template = component._template;
        var attributes = extend(true,{},component.attributes,config);

        // Process items
        var output = {};
        var attrConfig;
        for (var attr in attributes) {
          if (typeof attr !== 'undefined') {
            attrConfig = attributes[attr];
            output[attr] = mustacheComponent(attrConfig);
          }
        }

        // Add assets
        output = extend(true,output,assets);

        // If container, return function
        if (component.container) {
          return function(){
            return function(text, render) {
              var readyTemplate = template.toString();
              if (text) readyTemplate = readyTemplate.replace('{{{content}}}',text);
              return mustache.render(readyTemplate, output, partials);
            }
          }

        // Otherwise, renderer
        } else {
          return function() {
            var readyTemplate = template.toString();
            return mustache.render(readyTemplate, output, partials);
          }
        }

        // If

      } else {

        // If not a component
        var output = Array.isArray(config) ? [] : {};
        for (var child in config) {
          output[child] = mustacheComponent(config[child]);
        }
        return output;

      }

    }

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported')
            );
        }

        if (viewError) {
            this.emit(
                'error',
                new gutil.PluginError(PLUGIN_NAME, viewError.toString())
            );
        }

        // If data is componentized, groom data
        view = mustacheComponent(view);

        // Render contents
        file.contents = new Buffer(mustache.render(file.contents.toString(), view, partials));
        if (typeof opts.extension === 'string') {
            file.path = gutil.replaceExtension(file.path, opts.extension);
        }
        this.push(file);
        cb();
    });
};
