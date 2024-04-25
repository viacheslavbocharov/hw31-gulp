const BUILD_JS_FOLDER = './dist/js';
const JS_FOLDER = './src/js/*.js';

const gulp = require('gulp');
const minify = require('gulp-uglify-es').default;
//Clearance Dist
const clean = require('gulp-clean');
const fs = require('fs')



// function cleanDist() {
//     if (fs.existsSync('./dist/')) {
//         return gulp.src('./dist/')
//             .pipe(clean());
//     }
//     return Promise.resolve(); // Resolve promise if './dist/' doesn't exist
// }

gulp.task('clean', function () {
    return gulp.src('./dist/', {read: false})
        .pipe(clean({force: true}));
});

// gulp.task('clean', function (done){
//     if (fs.existsSync('./dist/')) {
//         return gulp.src('./dist/')
//             .pipe(clean());
//     }
//     done();
// })

function watchJS() {
    return gulp.watch(JS_FOLDER, minifyCopyJS)
}


function minifyCopyJS() {
    return gulp.src(JS_FOLDER)
        // .pipe(minify())
        .pipe(gulp.dest(BUILD_JS_FOLDER));
}


gulp.task('default', gulp.series(minifyCopyJS, watchJS));



