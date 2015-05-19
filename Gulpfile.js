var gulp = require('gulp'),
    chalk = require('chalk'),
    nodemon = require('gulp-nodemon'),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    reactify = require('reactify'),
    path = require('path');

gulp.task('js', function() {
    console.log(chalk.green.bold("Building New Bundle..."))
    gulp.src('client/app.js')
        .pipe(browserify({
                insertGlobals: true,
                transform: ['reactify'],
                debug: !gulp.env.production
            })
         )
         .pipe(gulp.dest('./public/js'))
});

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
    gulp.watch('./client/**', ['js']);
});
