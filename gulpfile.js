var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();


gulp.task('clean-script', function () {
    return gulp.src('js/bundle/*.js', {read: false})
      .pipe(clean());
});

gulp.task('clean-css', function () {
    return gulp.src('css/bundle/*.css', {read: false})
      .pipe(clean());
});

gulp.task('jsBundle',['clean-script'], function () {
    gulp.src(['node_modules/jquery/dist/jquery.js','node_modules/sweetalert2/dist/sweetalert2.all.js','node_modules/handlebars/dist/handlebars.min.js','js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('js/bundle'))
        .pipe(browserSync.stream());
});

gulp.task('cssBundle',['clean-css'], function(){
    gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css','node_modules/sweetalert2/dist/sweetalert2.css','css/sass/**/*.scss'])      
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('css/bundle'))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    return gulp.src('node_modules/font-awesome/fonts/*')
      .pipe(gulp.dest('fonts'))
});

gulp.task('serve', ['jsBundle','cssBundle'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('./js/**/*.js', ['jsBundle']);
    gulp.watch('./css/sass/**/*.scss', ['cssBundle']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);