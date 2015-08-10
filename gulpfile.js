var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('default', function () {
    return gulp.src('src/jquery.porthole.es6')
        .pipe(babel({
            modules : 'umd'
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('watch', function () {
    watch('src/jquery.porthole.es6', function() {
        return gulp.src('src/jquery.porthole.es6')
            .pipe(babel({
                modules : 'umd'
            }))
            .pipe(gulp.dest('dist'));
    });
});

gulp.task('compress', function () {
    return gulp.src('src/jquery.porthole.es6')
        .pipe(babel({
            modules : 'umd'
        }))
        .pipe(uglify())
        .pipe(rename('jquery.porthole.min.js'))
        .pipe(gulp.dest('dist'));
});
