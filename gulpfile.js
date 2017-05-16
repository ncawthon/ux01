var gulp = require('gulp'),
  bower = require('gulp-bower'),
  imagemin = require('gulp-imagemin'),
  sass = require('gulp-sass'),
  autoprefix = require('gulp-autoprefixer'),
  uglify = require('gulp-uglifyjs'),
  htmlmin = require('gulp-htmlmin'),
  notify = require('gulp-notify'),
  deploy = require('gulp-gh-pages'),  
  browserSync = require('browser-sync').create()
;
var config = {
  bowerDir: './bower_components',
  srcDir: './src',
  distDir: './dist'
};

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});

gulp.task('fonts', function () {
  return gulp.src([config.bowerDir + '/bootstrap-sass/assets/fonts/**/*'])
  .pipe(gulp.dest(config.distDir + '/fonts'));
});

gulp.task('img', function () {
  return gulp.src([config.srcDir + '/img/*'])
    .pipe(imagemin())
    .pipe(gulp.dest(config.distDir + '/img'));
});

gulp.task('css', function () {
  return gulp.src([
      config.bowerDir + '/featherlight/src/featherlight.css',
      config.srcDir + '/sass/app.scss'
    ])
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [config.bowerDir + '/bootstrap-sass/assets/stylesheets'],
    }))
    .on('error', notify.onError(function (error) {
      return 'Error: ' + error.message;
    }))
    // .pipe(autoprefix('last 2 version'))
    .pipe(gulp.dest(config.distDir + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return gulp.src([
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
    config.bowerDir + '/jquery-sticky/jquery.sticky.js',
    config.bowerDir + '/featherlight/src/featherlight.js',
    config.bowerDir + '/Tabslet/jquery.tabslet.js',
    config.bowerDir + '/vimeo-player-js/dist/player.js',
    config.srcDir + '/js/*.js'
  ])
  .pipe(uglify('app.js', {
    compress: true,
    outSourceMap: true,
  }))
  .pipe(gulp.dest(config.distDir + '/js'));
});

gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('html', function () {
  gulp.src(config.srcDir + '/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest(config.distDir));
});

gulp.task('serve', ['css'], function () {
  browserSync.init({
    server: config.distDir
  });
  gulp.watch(config.srcDir + '/img/*', ['img']);
  gulp.watch(config.bowerDir + '/sass/**/*.scss', ['css']);
	gulp.watch(config.srcDir + '/sass/**/*.scss', ['css']);
	gulp.watch(config.srcDir + '/*.html', ['html']).on('change', browserSync.reload);
	gulp.watch(config.srcDir + '/js/**/*.js', ['js-watch']);
});

gulp.task('default', ['fonts', 'img', 'css', 'js', 'html', 'serve']);

/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});
