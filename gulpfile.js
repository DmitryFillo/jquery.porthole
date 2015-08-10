var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    return gulp.src('src/jquery.porthole.es6')
        .pipe(babel({
            modules : 'umd'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
