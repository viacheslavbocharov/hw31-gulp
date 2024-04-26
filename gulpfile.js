const BUILD_FOLDER = './dist'
const HTML_FOLDER = './*.html'

const BUILD_IMG_FOLDER = './dist/img'
const IMG_FOLDER = './src/img/**/*'

const BUILD_FONTS_FOLDER = './dist/fonts'
const FONTS_FOLDER = './src/fonts/**/*'

const BUILD_FILES_FOLDER = './dist/files'
const FILES_FOLDER = './src/files/**/*'

const BUILD_JS_FOLDER = './dist/js';
const JS_FOLDER = './src/js/*.js';

const BUILD_SASS_FOLDER = './dist/css'
const SASS_FOLDER = './src/styles/*.scss'




const gulp = require('gulp'); // working version 4.0.2
//js minification and concatanation
const minify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');

//sass
const sass = require('gulp-sass')(require('sass'));
//postcss
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
//Clean
const clean = require('gulp-clean');
const fs = require('fs');
//liveserver
const server = require('gulp-server-livereload');
//sourcemaps(help to detect line in scss file through devtools)
const sourcemaps = require('gulp-sourcemaps');
//avoid errorw while deployment
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const plumberNotify = (errorTitle) => {
    return {
        errorHandler: notify.onError({
            title: errorTitle,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}
//babel
const babel = require('gulp-babel');
//img minimise 
const imagemin = require('gulp-imagemin')

//chech if files were changed, take to task only changed files
const changed = require('gulp-changed-old')





gulp.task('clean', function (done) {
    if (fs.existsSync('./dist/')) {
        return gulp.src('./dist/', { read: false })
            .pipe(clean({ force: true }));
    }
    done()
});

function clearFolder(folderPath) {
    return gulp.src(folderPath, { read: false })
        .pipe(clean({ force: true }))
}


gulp.task('watch', () => {
    // gulp.watch(JS_FOLDER, gulp.parallel('js'))
    // gulp.watch(SASS_FOLDER, gulp.parallel('sass'))
    // gulp.watch(HTML_FOLDER, gulp.parallel('html'))
    // gulp.watch(FONTS_FOLDER, gulp.parallel('fonts'))
    // gulp.watch(FILES_FOLDER, gulp.parallel('files'))
    // gulp.watch(IMG_FOLDER, gulp.parallel('img'))
    gulp.watch(JS_FOLDER, gulp.parallel(gulp.series(() => clearFolder(BUILD_JS_FOLDER), 'js')))
    gulp.watch(SASS_FOLDER, gulp.parallel(gulp.series(() => clearFolder(BUILD_SASS_FOLDER), 'sass')))
    gulp.watch(HTML_FOLDER, gulp.parallel(gulp.series(() => clearFolder(BUILD_FOLDER), 'html')))
    gulp.watch(FONTS_FOLDER, gulp.parallel(gulp.series(() => clearFolder(BUILD_FONTS_FOLDER), 'fonts')))
    gulp.watch(FILES_FOLDER, gulp.parallel(gulp.series(() => clearFolder(BUILD_FILES_FOLDER), 'files')))
    gulp.watch(IMG_FOLDER, gulp.parallel(gulp.series(() => clearFolder(BUILD_IMG_FOLDER), 'img')))

})


// if we want specific file order - use array as: ["./src/js/functions.js", "./src/js/data.js", "./src/js/app.js"]
gulp.task('js', () => {
    return gulp.src(["./src/js/functions.js", "./src/js/data.js", "./src/js/app.js"])
        .pipe(plumber(plumberNotify('JS')))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['babel-preset-env']
        }))
        .pipe(minify())
        .pipe(concat('build.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(BUILD_JS_FOLDER))
})



gulp.task('sass', () => {
    var plugins = [
        autoprefixer(),
        cssnano()
    ];
    return gulp.src(SASS_FOLDER)
        .pipe(plumber(plumberNotify('Styles')))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(BUILD_SASS_FOLDER))
})

gulp.task('html', () => {
    return gulp.src(HTML_FOLDER)
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(gulp.dest(BUILD_FOLDER))
})

gulp.task('img', () => {
    return gulp.src(IMG_FOLDER)
        // .pipe(changed(BUILD_IMG_FOLDER))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest(BUILD_IMG_FOLDER))
})

gulp.task('fonts', () => {
    return gulp.src(FONTS_FOLDER)
        .pipe(gulp.dest(BUILD_FONTS_FOLDER))
})

gulp.task('files', () => {
    return gulp.src(FILES_FOLDER)
        .pipe(gulp.dest(BUILD_FILES_FOLDER))
})

gulp.task('startServer', () => {
    gulp.src('./dist/')
        .pipe(server({
            livereload: true,
            //   directoryListing: true,
            open: true
        }));
})


gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html', 'js', 'sass', 'img', 'fonts', 'files'),
    gulp.parallel('watch', 'startServer')
));



