var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var babelConf = {
    modules : 'umd',
    optional : 'es7.comprehensions'
}

var srcDir = 'src'
var distDir = 'dist'

var baseFile = 'jquery.porthole'
var srcFile = baseFile+'.es6'
var distFile = baseFile+'.js'
var minFile = baseFile+'.min.js'

gulp.task('compile', function () {
    gulp.src(srcDir+'/'+srcFile)
        .pipe(babel(babelConf))
        .pipe(gulp.dest(distDir));
});

gulp.task('compress', function () {
    gulp.src(distDir+'/'+distFile)
        .pipe(uglify())
        .pipe(rename(minFile))
        .pipe(gulp.dest(distDir));
});

gulp.task('default', ['compile', 'compress']);

gulp.task('watch', function() {
    gulp.watch(srcDir+'/**', ['compile']);
});
