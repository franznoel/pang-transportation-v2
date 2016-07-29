'use strict';
var gulp = require('gulp');
var clean = require('gulp-clean');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
var cssNano = require('gulp-cssnano');
var gpConcat = require('gulp-concat');
var browserSync = require('browser-sync').create();

gulp.task('clean',function() {
  return gulp.src('app',{read:false})
    .pipe(clean({force:true}));
});

gulp.task('copy', function () {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('app'));

  gulp.src('src/**/{*.jpg,*.png,*.gif}')
    .pipe(gulp.dest('app'));

  gulp.src('src/sw.js')
    .pipe(gulp.dest('app'));
});

gulp.task('compress',function() {
  gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/bootstrap.js',
      'src/scripts/app.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(minify())
    .pipe(gpConcat('app.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('app/scripts'));

  gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'src/css/style.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(cssNano())
    .pipe(gpConcat('styles.css'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('default',function() {
  browserSync.init({
    server: "app/"
  });

  gulp.watch('src/**/*.html',['copy']).on('change',browserSync.reload);
  gulp.watch('src/**/{*.js,*.css}',['compress']).on('change',browserSync.reload);

  browserSync.stream({
    reloadDelay:3000
  });
});
