'use strict';

////////////////////////////////////////////////////////////////////////////////

// Gulp libs

////////////////////////////////////////////////////////////////////////////////

var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var template = require('gulp-template');
var rename = require("gulp-rename");
var exec = require('child_process').exec;
var argv = require('yargs').argv;

////////////////////////////////////////////////////////////////////////////////

// Default environment specific variables

////////////////////////////////////////////////////////////////////////////////

var minifyStyles = false;
var isProd = false;

////////////////////////////////////////////////////////////////////////////////

// Main build tasks

////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['serve']);

gulp.task('serve', [
  'sass',
  'templates',
  'render',
  'connect',
  'watch'
]);

gulp.task('serveProd', ['build'], function(){
  connect.server({
    root: 'dist'
  });
});

gulp.task('build', [
  'setProdVariables',
  'clean',
  'sass',
  'templates',
  'render',
  'buildjs'
]);

////////////////////////////////////////////////////////////////////////////////

// Set production variables

////////////////////////////////////////////////////////////////////////////////

gulp.task('setProdVariables', function(){
  minifyStyles = true;
  isProd = true;
});

////////////////////////////////////////////////////////////////////////////////

// Remove the dist folder for a fresh build

////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
  exec('rm -rf dist', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
    else {
      console.log('clean complete');
    }
  });
});

////////////////////////////////////////////////////////////////////////////////

// Compile sass into a single css file

////////////////////////////////////////////////////////////////////////////////


gulp.task('sass', function () {
  var sassCompile = gulp.src('./app/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError));
  if(minifyStyles) {
    sassCompile.pipe(minifyCSS());
  }
  sassCompile.pipe(gulp.dest('./dist/css'));
});

////////////////////////////////////////////////////////////////////////////////

// Bundle the js using jspm, see package.json for the buildjs cmd

////////////////////////////////////////////////////////////////////////////////

gulp.task('buildjs', function(){
  exec('npm run buildjs', function (err, stdout, stderr) {
    if (err) {
      throw err;
    }
    else {
      console.log('buildjs complete');
    }
  });
});

////////////////////////////////////////////////////////////////////////////////

// Local server for development

////////////////////////////////////////////////////////////////////////////////

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

////////////////////////////////////////////////////////////////////////////////

// Watch Tasks for livereload

////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.html', 'index.html'], ['html']);
  gulp.watch(['./app/**/*.js'], ['js']);
  gulp.watch(['./app/styles/**/*.scss'], ['css']);
});

gulp.task('html', ['templates'], function () {
  gulp.src('./dist/html/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./app/**/*.js')
    .pipe(connect.reload());
});

gulp.task('css', ['sass'], function () {
  gulp.src('./dist/css')
    .pipe(connect.reload());
});

////////////////////////////////////////////////////////////////////////////////

// Precompile the Angular templates to avoid ajax calls for every template path

////////////////////////////////////////////////////////////////////////////////

gulp.task('templates', function(){
  return gulp.src('./app/**/*.html')
    .pipe(templateCache({
      standalone: true,
      templateHeader: 'import angular from "angular"; export default angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache){'
    }))
    .pipe(gulp.dest('./app/cachedTemplates'))
});

////////////////////////////////////////////////////////////////////////////////

// Use the index-template to render the index.html file

////////////////////////////////////////////////////////////////////////////////

gulp.task('render', function(){
  var stream = gulp.src('./index-template.html')
    .pipe(template({isProd: isProd}))
    .pipe(rename('index.html'));
  if(isProd) {
    stream.pipe(gulp.dest('./dist'));
  } else {
    stream.pipe(gulp.dest('./'));
  }
});