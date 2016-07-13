'use strict';
var gulp = require('gulp');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();

gulp.task('clean',function() {
  return gulp.src('app',{read:false})
    .pipe(clean({force:true}));
});

gulp.task('copy', function () {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('app'));

  gulp.src('src/**/*.js')
    .pipe(gulp.dest('app/scripts'));

  gulp.src('src/**/*.css')
    .pipe(gulp.dest('app/css'));

  gulp.src('libs/**/{*.css,*.js}')
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
