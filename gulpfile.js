var gulp = require('gulp');
var babel = require('gulp-babel');
var jison = require('gulp-jison')

gulp.task('compile-jison', function () {
    return gulp.src('src/lib/svglengthparser.jison')
               .pipe(jison({ moduleType: 'commonjs' }))
               .pipe(gulp.dest('lib/'));
});

gulp.task('transpile-es6-src', function () {
    return gulp.src('src/lib/*.es6')
		   .pipe(babel({
		       presets: ['es2015']
		   }))
		   .pipe(gulp.dest('lib'));
});

gulp.task('transpile-es6-test', function () {
    return gulp.src('src/test/*.es6')
		   .pipe(babel({
		       presets: ['es2015']
		   }))
		   .pipe(gulp.dest('test'));
});

gulp.task('build', ['transpile-es6-src', 'transpile-es6-test', 'compile-jison']);
