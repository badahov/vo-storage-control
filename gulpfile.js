const gulp = require('gulp');

//Удаляет указанную папку
const del  = require('del');

//Запустить исполнение команды npm
const run = require('gulp-run');

const log = require('fancy-log');

//Минификация js
const minify = require('gulp-minify');

// ****************************************************** //
// ****************************************************** //

gulp.task('clean_build', function() {
  return del('build/**');
});

gulp.task('clean_lib', function() {
  return del('lib/**');
});

gulp.task('clean_before', gulp.series(gulp.parallel('clean_build','clean_lib')));

gulp.task('npm', function () {
  log('build');
  return run('npm run prod').exec();
});

gulp.task('clean_test', function() {
  return del('build/__tests__');
});

gulp.task('clean_after', gulp.series('clean_build'));

gulp.task('compress', function() {
  return gulp.src(['build/**/*.js'])
    .pipe(minify({
        noSource:true,
        ext:{
           src:'-debug.js',
           min:'.js'
        },
        //exclude: ['tasks'],
        ignoreFiles: ['.min.js']
    }))
    .pipe(gulp.dest('lib'))
});

gulp.task('build', gulp.series('clean_before','npm','clean_test','compress','clean_after'));
