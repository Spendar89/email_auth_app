var gulp = require('gulp'),
    chalk = require('chalk'),
    nodemon = require('gulp-nodemon'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    path = require('path');

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
