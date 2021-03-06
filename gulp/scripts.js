'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var ngAnnotate = require('gulp-ng-annotate');

var $ = require('gulp-load-plugins')();

  var tsProject = $.typescript.createProject({
    target: 'es5',
    sortOutput: true
  });

  gulp.task('dist', ['scripts'], function () {

    return gulp.src(path.join(conf.paths.tmp, '/dist/**/*.js'))
      .pipe($.sourcemaps.init())
      .pipe(ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
      .pipe($.sourcemaps.write('maps'))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
      .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

  gulp.task('dist-debug', ['scripts'], function () {

    return gulp.src(path.join(conf.paths.tmp, '/dist/**/*.js'))
      .pipe($.sourcemaps.init())
      .pipe($.concat('vs.toolkit.src.js'))
      .pipe($.sourcemaps.write('maps'))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
      .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

  gulp.task('scripts', ['tsd:install'], function () {
  return gulp.src(path.join(conf.paths.src, '/**/*.ts'))
    .pipe($.sourcemaps.init())
    .pipe($.tslint())
    .pipe($.tslint.report('prose', { emitError: false }))
    .pipe($.typescript(tsProject)).on('error', conf.errorHandler('TypeScript'))
    .pipe($.concat('vs.toolkit.min.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/dist')))
    .pipe($.size())
});
