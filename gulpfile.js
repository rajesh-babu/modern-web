"use strict";

// Configuration
var pkg = require('./package.json');
var config = pkg.buildConfig;
var siteData = {};

// References
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var path = require("path");
var merge = require('merge-stream');
var jeditor = require('gulp-json-editor');
var extend = require('node.extend');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gulpHeader = require('gulp-header');
var rjs = require('requirejs');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var mustache = require('./node_modules/modern-web-ui-core/modern-mustache-components');
var rename = require('gulp-rename');

// When session starts
gulp.task('default', function(cb) {
  gulpSequence('build', cb);
});

// Default
gulp.task('build', function(cb){
  gulpSequence(
    ['clean-all'], ['build-html', 'build-assets'],
    ['build-css', 'build-header-js', 'build-footer-js'],
    cb);
});

// Deploy build
gulp.task('build-deploy', function(cb){
  gulpSequence(
    ['clean-all'],
	['build-assets'],
    [ 'build-css-deploy', 'build-footer-js-deploy', 'build-header-js-deploy'],
    cb);
});


// Clean up tasks
gulp.task('clean-all', function(cb) { del(['./build/**/*.*'], cb); });


// Create JSON
gulp.task('build-json', function() {
  // Remove json data from cache if found and reload
  siteData.pages = {};
  return gulp.src('./src/data/*.json')
    .pipe(jeditor(function(json){
      extend(true,siteData.pages,json);
      return json;
    }));
});

// Create html
gulp.task('build-html', ['build-json'], function (cb) {
	var pageInfo,streams=[];
	var opts = {
		assetsHandler: function(){}
	};
	for (var p in siteData.pages) {
		pageInfo = extend(true,{},siteData.site,siteData.pages[p]);
		streams.push(gulp.src("./src/html/templates/" + pageInfo.template)
			.pipe(mustache(pageInfo,opts))
			.pipe(rename(pageInfo.url))
			.pipe(gulp.dest('./build')));
	}
	return merge(streams);
});

// Copy assets
gulp.task('build-assets', function() {
  var data = config.assets;
  var streams = [];
  var dataset;
  for (var d=0;d<data.length;d++) {
    dataset = data[d];
    streams.push(gulp.src(dataset.patterns, { cwd: path.resolve(config.basePath) })
      .pipe(flatten())
      .pipe(gulp.dest(config.destPath + dataset.dest)));
  }
  return merge(streams);
});


// Generate CSS from SASS
gulp.task('build-css', function() {
  var data = config.globalCSS;
  var patterns = data.patterns;
  var streams = [];
  var d = new Date();
  var headerComment = '/* Generated on: ' + d + ' */';
  for (var d=0;d<patterns.length;d++) {
    streams.push(
      gulp.src(patterns[d], { cwd: path.resolve(config.basePath) })
        .pipe(sourcemaps.init())
        .pipe(concat(data.outputFile))
    );
  }
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(sass({
        errLogToConsole: true,
        includePaths : [
            config.basePath + '/modern-web-vendor-bootstrap/assets/scss'
        ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});

// Generate CSS from SASS and minify for deploy
gulp.task('build-css-deploy', function() {
  var data = config.globalCSS;
  var patterns = data.patterns;
  var streams = [];
  var d = new Date();
  var headerComment = '/* Generated on: ' + d + ' */';
  for (var d=0;d<patterns.length;d++) {
    streams.push(
      gulp.src(patterns[d], { cwd: path.resolve(config.basePath) })
        .pipe(concat(data.outputFile))
    );
  }
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'compressed',
        includePaths : [
            config.basePath + '/modern-web-vendor-bootstrap/assets/scss'
        ]
    }))
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});

// Generate header JS. Header JS files should be minified in advance so only concat files together
gulp.task('build-header-js', function() {
  var data = config.headerJS;
  var patterns = data.patterns;
  var streams = [];
  for (var d=0;d<patterns.length;d++) {
    streams.push(gulp.src(patterns[d], { cwd: path.resolve(config.basePath) }));
  }
  var d = new Date();
  var headerComment = '/* Generated on: ' + d + ' */';
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(sourcemaps.init())
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});

// Generate footer js from AMD
gulp.task('build-footer-js', function(done) {
  var data = config.footerJS;
  var module = data.configFile;
  rjs.optimize({
    "mainConfigFile": path.join(config.basePath,data.configFile+'.js'),
    "baseUrl": path.resolve(config.basePath),
    "name": data.almondFile,
    "include": [ data.configFile],
    "wrap": true,
    "out": path.join(config.destPath + data.dest,data.outputFile),
    "optimize": "none",
    "generateSourceMaps": true,
    "preserveLicenseComments": false,
    "wrapShim": false,
    "normalizeDirDefines": 'skip',
    "skipDirOptimize": false
  }, function () {
    var d = new Date();
    var headerComment = '/* Generated on: ' + d + ' */';
    var stream = gulp.src(path.join(config.destPath + data.dest,data.outputFile))
      .pipe(gulpHeader(headerComment))
      .pipe(gulp.dest(config.destPath + data.dest));
    stream.on('end',function(){ done(); });
  }, done);
});


// Generate header JS for deploy (no sourcemaps). Header JS files should be minified in advance so only concat files together
gulp.task('build-header-js-deploy', function() {
  var data = config.headerJS;
  var patterns = data.patterns;
  var streams = [];
  for (var d=0;d<patterns.length;d++) {
    streams.push(gulp.src(patterns[d], { cwd: path.resolve(config.basePath) }));
  }
  var d = new Date();
  var headerComment = '/* Generated on: ' + d + ' */';
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});
// Generate footer js from AMD and minify for deploy
gulp.task('build-footer-js-deploy', function(done) {
  var data = config.footerJS;
  var module = data.configFile;
  rjs.optimize({
    "mainConfigFile": path.join(config.basePath,data.configFile+'.js'),
    "baseUrl": path.resolve(config.basePath),
    "name": data.almondFile,
    "include": [ data.configFile],
    "wrap": true,
    "out": path.join(config.destPath + data.dest,data.outputFile),
    "optimize": "uglify",
    "generateSourceMaps": false,
    "preserveLicenseComments": false,
    "wrapShim": false,
    "normalizeDirDefines": 'skip',
    "skipDirOptimize": false
  }, function () {
    var d = new Date();
    var headerComment = '/* Generated on: ' + d + ' */';
    var stream = gulp.src(path.join(config.destPath + data.dest,data.outputFile))
      .pipe(gulpHeader(headerComment))
      .pipe(gulp.dest(config.destPath + data.dest));
    stream.on('end',function(){ done(); });
  }, done);
});
