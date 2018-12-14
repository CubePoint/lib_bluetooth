var gulp = require('gulp');
var concat = require('gulp-concat');


gulp.task('default',['concat'], function() {
  gulp.watch(['./src/*.js','./service/*.js'],['concat']);
});  

gulp.task('concat',function() {
  gulp.src(['./service/base-service.js','./service/wxh5-service.js','./src/main.js'])
  .pipe(concat('lib-bluetooth-wxh5.js'))
  .pipe(gulp.dest('build'));

  gulp.src(['./service/base-service.js','./service/wxcx-service.js','./src/main.js'])
  .pipe(concat('lib-bluetooth-wxcx.js'))
  .pipe(gulp.dest('build'));
})


