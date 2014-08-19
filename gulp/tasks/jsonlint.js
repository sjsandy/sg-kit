/**
 * Created by shawnsandy on 8/14/14.
 */

var gulp = require('gulp');
var toJson = require('gulp-to-json');
var print = require('gulp-print'),
    jsonlint = require("gulp-json-lint"),
    jsonfile = './app/data/files.json',
    sequence = require('run-sequence');;


var jsonReport = function (lint, file) {
    if(lint.error){
        console.log(file.path + ': ' + lint.error);
    } else {
        console.log(file.path + " No errors found");
    }
};

gulp.task('tojson', function (){
    gulp.src(["./app/partials/*.html",'./app/*.html'])
        .pipe(toJson({
            filename: jsonfile,
            strip: /^.+\/?\\?Users\/?\\?shawnsandy\/?\\?sg-kit\/?\\?app\/?\\?/
}))
        .pipe(print());
})


gulp.task('json_lint', function(){
    gulp.src(jsonfile)
        .pipe(jsonlint())
        .pipe(jsonlint.report(jsonReport));
});

gulp.task('jsonlint', function(callback){
    sequence(
        'tojson',
        'json_lint'
    )
});