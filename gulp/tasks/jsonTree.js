/**
 * Created by shawnsandy on 8/18/14.
 */


var gulp = require('gulp'),
    jsonTree = require('gulp-tree');

gulp.task('jsontree', function() {
    gulp.src('./app/**.html')
        .pipe(jsonTree({
            patternsPath: './app',
            jsonPath : './app/data/tree/'
        }))
        .pipe(print());
})