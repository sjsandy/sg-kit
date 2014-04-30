var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var print = require('gulp-print');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var include = require('gulp-file-includer');
var sequence = require('run-sequence');
var grunt = require('gulp-grunt');
var inject = require('gulp-inject');


/*
 install gulp and dependencies the easy way
 *** ---- quick gulp + all package plugins ---- ***
 * npm install
 install gulp and dependencies the coder way
 *** ----- the coders way ----- ***
 * npm install gulp gulp-util --save-dev
 * ---- install required gulp plugins ---***
 * npm install event-stream gulp-concat gulp-rename gulp-uglify gulp-clean gulp-watch gulp-changed streamqueue gulp-print gulp-minify-css --save-dev
 */

//  create some useful variables

var srcDir = './src/';
var scriptsPath = srcDir + 'js/';
var buildPath = 'deploy/';

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('scripts', function () {

    var file_dir = 'js/';
    gulp.src(srcDir + file_dir + '*')
        .pipe(changed(buildPath + file_dir))
        .pipe(print())
        .pipe(gulp.dest(buildPath + file_dir));

    //custom folders

    var custom_folders = srcDir + file_dir
    var folders = getFolders(custom_folders);
    var tasks = folders.map(function (folder) {
        var src_folders = path.join(custom_folders, folder + '/*');
        // find/join the directories
        // minify
        // write to output
        return gulp.src(src_folders)
            .pipe(changed(buildPath + file_dir))
            .pipe(print())
            .pipe(gulp.dest(buildPath + file_dir + folder));

    });

    return es.concat.apply(null, tasks);
});

gulp.task('html_files', function () {
    //collect all files in root di
    //move to dest folder
    gulp.src(srcDir + '/*')
        .pipe(print())
        .pipe(gulp.dest(buildPath));

});

gulp.task('images', function () {

    var file_dir = 'images/';
    gulp.src(srcDir + file_dir + '*')
        .pipe(changed(buildPath + file_dir))
        .pipe(print())
        .pipe(gulp.dest(buildPath + file_dir));

    //custom folders

    var custom_folders = srcDir + file_dir
    var folders = getFolders(custom_folders);
    var tasks = folders.map(function (folder) {
        var src_folders = path.join(custom_folders, folder + '/*');
        // find/join the directories
        // minify
        // write to output
        return gulp.src(src_folders)
            .pipe(changed(buildPath + file_dir))
            .pipe(print())
            .pipe(gulp.dest(buildPath + file_dir + folder));

    });

    return es.concat.apply(null, tasks);

});


gulp.task('fonts', function () {

    var file_dir = 'images/';
    gulp.src(srcDir + file_dir + '*')
        .pipe(changed(buildPath + file_dir))
        .pipe(print())
        .pipe(gulp.dest(buildPath + file_dir));

    //custom folders

    var custom_folders = srcDir + file_dir
    var folders = getFolders(custom_folders);
    var tasks = folders.map(function (folder) {
        var src_folders = path.join(custom_folders, folder + '/*');
        // find/join the directories
        // minify
        // write to output
        return gulp.src(src_folders)
            .pipe(changed(buildPath + file_dir))
            .pipe(print())
            .pipe(gulp.dest(buildPath + file_dir + folder));

    });

    return es.concat.apply(null, tasks);

});


gulp.task('cleanup', function () {
    gulp.src(buildPath, {read: false})
        .pipe(clean());
});



gulp.task('css', function () {

    var file_dir = 'css/';
    gulp.src(srcDir + file_dir + '*')
        .pipe(changed(buildPath + file_dir))
        .pipe(print())
        .pipe(gulp.dest(buildPath + file_dir));
    //custom folders
    var custom_folders = srcDir + file_dir
    var folders = getFolders(custom_folders);
    var tasks = folders.map(function (folder) {
        var src_folders = path.join(custom_folders, folder + '/*');
        return gulp.src(src_folders)
            .pipe(changed(buildPath + file_dir))
            .pipe(print())
            .pipe(gulp.dest(buildPath + file_dir + folder));

    });

    return es.concat.apply(null, tasks);

});



/*
copies all the files from your src directory,
 src/dir -- (will not copy from scr/dir/dir )
 into your build
 made for simple structure apps
 */

gulp.task('copy_all', function () {
    //file directory
    var file_dir = '/';
    gulp.src(srcDir + file_dir + '*')
        .pipe(changed(buildPath + file_dir))
        .pipe(print())
        .pipe(gulp.dest(buildPath + file_dir));

    //custom folders
    var custom_folders = srcDir + file_dir
    var folders = getFolders(custom_folders);
    var tasks = folders.map(function (folder) {
        var src_folders = path.join(custom_folders, folder + '/*');
        // find/join the directories
        // minify
        // write to output
        return gulp.src(src_folders)
            .pipe(changed(buildPath + file_dir))
            .pipe(print())
            .pipe(gulp.dest(buildPath + file_dir + folder));

    });

    return es.concat.apply(null, tasks);

});


/*copy files/dependencies from root to the source folder */

gulp.task("srcbuild", function () {

    gulp.src('./bootstrap/dist/css/*.css')
        .pipe(gulp.dest(srcDir + 'bootstrap/css/'));
    gulp.src('./bootstrap/dist/js/*.js')
        .pipe(gulp.dest(srcDir + 'bootstrap/js/'));
    gulp.src('./knockout/build/output/knockout-latest.js')
        .pipe(gulp.dest(srcDir + 'js/vendor'));

});

gulp.task('default', ['html_files', 'scripts', 'fonts', 'images'], function () {});

// test - empty gulp task
gulp.task('test', function(){});
