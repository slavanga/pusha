var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var config = {
  'src': './',
  'dest': 'dist/',
  'minify': true
};


// HTML
gulp.task('html', function() {
  return gulp.src('*.html')
    .pipe(browserSync.stream());
});

// Compile and autoprefix stylesheets
gulp.task('styles', function() {
  return gulp.src(config.src + 'scss/*.scss')
    .pipe($.sass({
      precision: 8,
      outputStyle: 'expanded'
    }).on('error', function(error) {
      $.util.log($.util.colors.red(error.message));
      this.emit('end');
    }))
    .pipe($.postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(config.dest + 'css'))
    .pipe(browserSync.stream())
    .pipe($.cleanCss({compatibility: 'ie9'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.if(config.minify, gulp.dest(config.dest + 'css')))
    .pipe(browserSync.stream());
});

// Compile javascript
gulp.task('scripts', function() {
  return gulp.src(config.src + 'js/*.js')
    .pipe(gulp.dest(config.dest + 'js'))
    .pipe(browserSync.stream())
    .pipe($.uglify().on('error', function(error) {
      $.util.log($.util.colors.red(error.message));
      this.emit('end');
    }))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.if(config.minify, gulp.dest(config.dest + 'js')))
    .pipe(browserSync.stream());
});

// Build production files
gulp.task('build', ['html', 'styles', 'scripts']);

// Serve compiled files
gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: true,
    notify: false,
    snippetOptions: {
      rule: {
        match: /<\/body>/i
      }
    }
  });
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch(config.src + '*.html', ['html']);
  gulp.watch(config.src + 'scss/**/*.scss', ['styles']);
  gulp.watch(config.src + 'js/**/*.js', ['scripts']);
});

// Run all tasks
gulp.task('default', ['serve', 'watch']);
