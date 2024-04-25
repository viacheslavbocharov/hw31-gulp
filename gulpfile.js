const BUILD_FOLDER = './dist'
const HTML_FOLDER = './*.html'

const BUILD_IMG_FOLDER = './dist/img'
const IMG_FOLDER = './src/img/**/*'

const BUILD_JS_FOLDER = './dist/js';
const JS_FOLDER = './src/js/*.js';

const BUILD_SASS_FOLDER = './dist/css'
const SASS_FOLDER = './src/styles/*.scss'

const gulp = require('gulp');
const minify = require('gulp-uglify-es').default;
//sass
const sass = require('gulp-sass')(require('sass'));
//Clean
const clean = require('gulp-clean');
const fs = require('fs');
//liveserver
const server = require('gulp-server-livereload');




//НЕ находит файл, ошибка: Error: File not found with singular glob
gulp.task('clean', function (done) {
    if (fs.existsSync('./dist/')) {
        return gulp.src('./dist/', { read: false })
            .pipe(clean({ force: true }));
    }
    done()
});


gulp.task('watch', () => {
    gulp.watch(JS_FOLDER, gulp.parallel('js'))
    gulp.watch(SASS_FOLDER, gulp.parallel('sass'))
    gulp.watch(HTML_FOLDER, gulp.parallel('html'))
})


gulp.task('js', () => {
    return gulp.src(JS_FOLDER)
        .pipe(minify())
        .pipe(gulp.dest(BUILD_JS_FOLDER))
})

gulp.task('sass', () => {
    return gulp.src(SASS_FOLDER)
        .pipe(sass())
        .pipe(gulp.dest(BUILD_SASS_FOLDER))
})

gulp.task('html', () => {
    return gulp.src(HTML_FOLDER)
        .pipe(gulp.dest(BUILD_FOLDER))
})

gulp.task('img', () => {
    return gulp.src(IMG_FOLDER)
        .pipe(gulp.dest(BUILD_IMG_FOLDER))
})

//НЕ находит файл, ошибка: Error: File not found with singular glob
gulp.task('startServer', () => {
    return gulp.src('./dist/index.html')
        .pipe(server({
            livereload: true,
            open: true
        }))

})


gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html', 'js', 'sass', 'img'),
    gulp.parallel('watch', 'startServer')
));



