/**
 * Created by shawnsandy on 8/14/14.
 */

var gulp = require('gulp');
var toJson = require('gulp-to-json');
var jsonTree = require('gulp-tree');
var print = require('gulp-print');

gulp.task('tojson', function (){
    gulp.src(["./app/partials/*.html",'./app/*.html'])
        .pipe(toJson({
            filename: './app/data/files.json',
            strip: /^.+\/?\\?Users\/?\\?shawnsandy\/?\\?sg-kit\/?\\?app\/?\\?/
}))
        .pipe(print());
})

gulp.task('jsontree', function() {
    gulp.src('./app/**.html')
        .pipe(jsonTree({
            patternsPath: './app',
            jsonPath : './app/data/tree/'
        }))
        .pipe(print());
})