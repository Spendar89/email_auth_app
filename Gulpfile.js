var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint');

gulp.task('lint', function () {
    gulp.src('./*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('develop', function () {
    nodemon({
        script: 'app.js',
        ext: 'html js',
        ignore: ['public/**']
    })
    .on('change', ['lint'])
});
