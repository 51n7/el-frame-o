var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var browserify = require('gulp-browserify');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

var sass_dest = '../assets/';

function handleError (err) {
  console.log(err);
  this.emit('end');
}

gulp.task('clear', function () {
  console.clear();
  return this;
});

gulp.task('sass', function () {
  var stream = gulp.src('scss/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .on('error', handleError)
    .pipe(autoprefixer())
    .pipe(gulp.dest( sass_dest ));
  return stream;
});

gulp.task('sass-min', function () {
  var stream = gulp.src('scss/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .on('error', handleError)
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest( sass_dest ));
  return stream;
});

gulp.task('default', ['clear', 'sass']);

gulp.task('watch', ['clear'], function () {
  gulp.watch('scss/**/*.scss', ['clear', 'sass']);
});
