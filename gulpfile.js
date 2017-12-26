// Defining base pathes
var basePaths = {
  node: './node_modules/',
  src: './src/'
};

// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');

// Run: 
// gulp watch
// Starts watcher. Watcher runs appropriate tasks on file changes
gulp.task('watch', function () {
  gulp.watch('./src/**/*.js', ['build-scripts']);
});

// Run: 
// gulp
// Defines gulp default task
gulp.task('default', ['watch'], function () { });

// Run: 
// gulp build-scripts. 
// Uglifies and concat all JS files into one
gulp.task('build-scripts', function() {
  var src = [
      basePaths.src + 'hamburger-menu-src.js'
    ];

  var srcPolyfilled = [
      basePaths.src + 'shared/polyfill-closest.js',
      basePaths.src + 'shared/polyfill-CustomEvents.js',
      basePaths.src + 'hamburger-menu-src.js'
    ];

  // COMPILED (default)
  gulp.src( src )
    .pipe(sourcemaps.init())
    .pipe(concat('hamburger-menu.js'))
    .pipe(gulp.dest('./dist/')) // save .js
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./dist/'));

  // POLYFILLED
  // compiled with polyfills
  gulp.src( srcPolyfilled )
    .pipe(sourcemaps.init())
    .pipe(concat('hamburger-menu-polyfilled.js'))
    .pipe(gulp.dest('./dist/')) // save .js
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./dist/'));

});
