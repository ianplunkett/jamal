var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

var path = require('path');

var paths = {
    es6: ['../src/*.js', '../tests/test.js'],
    es5: '../out/cli/',
    // Must be absolute or relative to source map
    sourceRoot: path.join(__dirname, 'es6')
};
gulp.task('babel', function () {
    return gulp.src(paths.es6)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.', { sourceRoot: paths.sourceRoot }))
        .pipe(gulp.dest(paths.es5));
});
gulp.task('watch', function() {
    gulp.watch(paths.es6, ['test']);
});

var exec = require('child_process').exec;
 
gulp.task('test', ['babel'], function (cb) {
  exec('node ../out/cli/test.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('default', ['watch']);
