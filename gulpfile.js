'use strict';
var gulp = require('gulp'),
  clean = require('gulp-clean'),
  minify = require('gulp-minify'),
  sourcemaps = require('gulp-sourcemaps'),
  cssNano = require('gulp-cssnano'),
  gpConcat = require('gulp-concat'),
  browserSync = require('browser-sync').create();

gulp.task('clean',function() {
  return gulp.src('app',{read:false})
    .pipe(clean({force:true}));
});

gulp.task('copy', function () {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('app'));

  gulp.src('src/**/{*.jpg,*.png,*.gif}')
    .pipe(gulp.dest('app'));

  gulp.src('src/**/*.json')
    .pipe(gulp.dest('app'));

  gulp.src('src/sw.js')
    .pipe(gulp.dest('app'));
});

gulp.task('compress',function() {
  gulp.src([
      'node_modules/angular/angular.js',
      'src/scripts/routes.js',
      'src/scripts/app.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/scripts'));

  gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
      'node_modules/bootstrap/dist/css/bootstrap-theme.css',
      'src/css/style.css'
    ])
    .pipe(cssNano())
    .pipe(gpConcat('styles.css'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('default',function() {
  browserSync.init({
    server: "app/"
  });

  gulp.watch('src/**/*.html',['copy']).on('change',browserSync.reload);
  // gulp.watch('src/**/{*.js,*.css}',['compress']).on('change',browserSync.reload);

  browserSync.stream({
    reloadDelay:3000
  });
});
