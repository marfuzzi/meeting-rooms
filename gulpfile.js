'use strict';

const gulp = require('gulp'), // Gulp
    autoprefixer = require('gulp-autoprefixer'), // Добавление вендорных префиксов (adding of vendor prefixers)
    concat = require('gulp-concat'), // Объединение файлов (files merger)
    csso = require('gulp-csso'), // Минификация CSS-файлов (minification of CSS files)
    del = require('del'), // Удаление папок и файлов (delete of folders and files)
    imagemin = require('gulp-imagemin'), // Оптимизация изображений (images optimization)
    plumber = require('gulp-plumber'), // Обработка ошибок (error handling)
    pngquant = require('imagemin-pngquant'), // Оптимизация PNG-изображений (PNG images optimization)
    pug = require('gulp-pug'), // Pug
    rename = require('gulp-rename'), // Переименование файлов (files rename)
    sourcemaps = require('gulp-sourcemaps'),
    stylus = require('gulp-stylus'), // Stylus
    uglify = require('gulp-uglify'), // Минификация JS-файлов (minification of JS files)
    gcmq = require('gulp-group-css-media-queries');// Группировка медиа запросов

const browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

gulp.task('serve', () => {
    browserSync.init({
        server: './app'
    });
    gulp.watch('./app/pug/**/*.pug', gulp.series('html'));
    gulp.watch(['./app/blocks/**/*.styl',
            './app/styl/**/*.styl'], gulp.series('css'));
    gulp.watch('./app/blocks/**/*.js', gulp.series('js'));
    gulp.watch('*.html').on('change', reload);
});

gulp.task('cssVendor', () => {
    return gulp.src([
        './app/vendor/normalize-css/normalize.css',
        './app/vendor/font-awesome/css/font-awesome.min.css'
    ])
    .pipe(concat('vendor.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('./app/assets/css'));
});

gulp.task('jsVendor', () => {
    return gulp.src('app/vendor/jquery/dist/jquery.min.js')
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/assets/js'));
});

gulp.task('fontsVendor', () => {
    return gulp.src('./app/vendor/font-awesome/fonts/**/*.*')
    .pipe(gulp.dest('./app/assets/fonts'));
});

gulp.task('html', () => {
    return gulp.src('./app/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('./app'))
        .pipe(browserSync.stream());
});

gulp.task('css', () => {
    return gulp.src('./app/styl/styles.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(gcmq())
        .pipe(gulp.dest('./app/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(csso())
        .pipe(gulp.dest('./app/assets/css'))
        .pipe(sourcemaps.write())
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('./app/blocks/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./app/assets/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./app/assets/js'))
        .pipe(sourcemaps.write())
        .pipe(browserSync.stream());
});

gulp.task('build',
    gulp.parallel( 'cssVendor', 'jsVendor', 'fontsVendor', 'html', 'css', 'js'));

gulp.task('clean', () => {
  return del('./dist');
});

gulp.task('img', () => {
  return gulp.src('./app/static/images/**/*.*')
    .pipe(imagemin({use: [pngquant]}))
    .pipe(gulp.dest('./dist/static/images'))
});

gulp.task('dist', () => {
  const htmlDist = gulp.src('./app/*.html')
    .pipe(gulp.dest('./dist'));
  const cssDist = gulp.src('./app/assets/css/*.css')
    .pipe(gulp.dest('./dist/assets/css'));
  const jsDist = gulp.src('./app/assets/js/*.js')
    .pipe(gulp.dest('./dist/assets/js'));
  const fontsDist = gulp.src('./app/assets/fonts/*.*')
    .pipe(gulp.dest('./dist/assets/fonts'));
  return htmlDist, cssDist, jsDist, fontsDist;
});

gulp.task('default', gulp.series('build', 'serve'));
gulp.task('public', gulp.series('clean', 'img', 'dist'))
