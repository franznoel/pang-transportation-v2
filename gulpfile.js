'use strict';
var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanCss = require('gulp-clean-css');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

gulp.task('clean',function() {
  return gulp.src('app',{read:false})
    .pipe(clean({force:true}));
});

gulp.task('copy', function () {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('app'));

  gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app'));

  gulp.src('src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app'));

  gulp.src('src/**/{*.jpg,*.png,*.gif}')
    .pipe(gulp.dest('app'));

  gulp.src('bower_components/**/{*.css,*.js}')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/libs/'));
});

gulp.task('default',function() {
  browserSync.init({
    server: "app/"
  });

  gulp.watch('src/**/*.*',['copy']).on('change',browserSync.reload);

  browserSync.stream({
    reloadDelay:3000
  });
});
