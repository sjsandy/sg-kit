/* require dependencies */

var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var clean = require('gulp-clean');
var print = require('gulp-print');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var include = require('gulp-file-includer');
var sequence = require('run-sequence');
var grunt = require('gulp-grunt');
var inject = require('gulp-inject');
var bower = require('gulp-bower-files');
var ignore = require('gulp-ignore');
var browserify = require('browserify');
var flatten = require('gulp-flatten');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var refresh = require('gulp-livereload');
var connect = require('connect');
var express = require('express');
var livereload = require('connect-livereload');
var config = require("./config.json");
var open = require('gulp-open');
var notify = require('gulp-notify');
var sync = require('browser-sync');

/*
 install gulp and dependencies the easy way
 *** ---- quick gulp + all package plugins ---- ***
 * npm install
 install gulp and dependencies the coder way
 *** ----- the coders way ----- ***
 * npm install gulp gulp-util --save-dev
 * ---- install required gulp plugins ---***
 * npm install event-stream gulp-concat gulp-rename gulp-uglify gulp-clean gulp-watch gulp-changed
 * streamqueue gulp-print gulp-minify-css --save-dev
 */

//  create some useful variables

var srcDir = config.source_directory;
var scriptsPath = srcDir + 'js/';
var buildPath = config.build_directory,
    livereloadport = config.live_reload_port;
    serverport = config.server_port;
    ignore_files = [''];

//---- file filters --

var filterJs = filter('**/*.js'),
    filterOutJsMin = filter('!**/*.min.js'),
    filterCss = filter('**/*.css'),
    filterOutCss= filter('!**/*.min.css'),
    filterOutless = filter('!less/**/*.*');

//-----end config ----


function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

/* copy js/scripts to build directory */
gulp.task('scripts', function () {

    var file_dir = 'js/';
    gulp.src(srcDir + file_dir + '**/*.*',{ base: './app/js' })
        .pipe(changed(buildPath + file_dir))
        .pipe(gulp.dest(buildPath + file_dir))
        .pipe(print());

});

/* copy html files to the build */
gulp.task('html', function () {
    //collect all files in root di
    //move to dest folder
    gulp.src(srcDir + '/*')
        .pipe(gulp.dest(buildPath))
        .pipe(print());
});


/* copy images to build */
gulp.task('images', function () {

    var file_dir = 'images/';
    gulp.src(srcDir + file_dir + '**/*.*', { base: './app/'+ file_dir })
        .pipe(changed(buildPath + file_dir))
        .pipe(gulp.dest(buildPath + file_dir))
        .pipe(print()) ;

});


/* copy fonts to the build directory  */
gulp.task('fonts', function () {

    var file_dir = 'fonts/';
    gulp.src(srcDir + file_dir + '**/*.*',{ base: './app/' + file_dir })
        .pipe(changed(buildPath + file_dir))
        .pipe(gulp.dest(buildPath + file_dir))
        .pipe(print());
});

/* copy styles to build directory */
gulp.task('styles', function () {

    var file_dir = 'css/';
    gulp.src(srcDir + file_dir + '**/*.css',{ base: './app/' + file_dir })
        .pipe(changed(buildPath + file_dir))
        .pipe(gulp.dest(buildPath + file_dir))
        .pipe(print());
});

/* inject source */
gulp.task("inject:files", function(){
    gulp.src(srcDir + '*.html')
        .pipe(inject(gulp.src([srcDir + "js/**/*.min.js", srcDir + "css/**/*.min.css"], {read: false})))
        .pipe(gulp.dest(buildPath + '/'))
        .pipe(print());
});

/* default task */
gulp.task('default', ['html_files', 'scripts', 'fonts', 'images'], function () {});

// moves directory (entire) listed in src_files to a deploy directory
gulp.task('move', function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src(src_files, { base: './app' })
        .pipe(gulp.dest(buildPath))
        .pipe(print());
});

// This will run in this order:
// * clean
// * scripts and build-styles in parallel
// * html
// * images
// * fonts
// * Finally call the callback function
gulp.task('sg:deploy', function(callback){
    sequence(
        //'sg:start',
        'cleanup',
        ['scripts', 'styles'],
        'html',
        'images',
        'fonts',
        'sg:open-server',
        callback);
});

/* copy all files to src directory */
gulp.task('sg:setup', function(){

    es.merge(
        bower()
            .pipe(gulp.dest(srcDir + 'js/vendor'))
            .pipe(filterJs)
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(filterJs.restore())
            .pipe(gulp.dest(srcDir + 'js/vendor/'))
            .pipe(print()),
        gulp.src('./bower_components/bootstrap/dist/js/*.js')
            .pipe(gulp.dest(srcDir + 'js/vendor/'))
            .pipe(print()),
        gulp.src(['./bower_components/fontawesome/css/*.css','./bower_components/fontawesome/fonts/*.*'], { base: './bower_components/' })
            .pipe(gulp.dest(srcDir + 'css/vendor/'))
            .pipe(print())
    )
})


/* copy bower files into your src/ app directory */
gulp.task('sg:start', function(){
    sequence(
        'clean:vendor',
        ['sg:setup'],
        'sg:open-server-dev'
    );
})

/* delete all the files in the deploy directory */
gulp.task('cleanup', function () {
    gulp.src(buildPath + '**/*.*' , {read: false})
        .pipe(print())
        .pipe(clean());
});

/* delete the deploy directory  */
gulp.task('clean', function () {
    gulp.src(buildPath, {read: false})
        .pipe(print())
        .pipe(clean());
});

/* removes the vendor directory */
gulp.task('clean:vendor', function(){
   gulp.src([srcDir + 'js/vendor/**/*.*', srcDir + 'css/vendor/'], {read: false})
    .pipe(print())
    .pipe(clean());
});

/* start the server */
gulp.task('sg:server', function(){
    var app = express()
    app.use(livereload({port: livereloadport}));
    app.use(express.static('./app'));
    app.listen(config.server_port);

});


/* start the development server */
gulp.task('sg:server-dev', function(){
    var app = express();
    app.use(livereload({port: livereloadport}));
    app.use(express.static('./app'));
    app.listen(config.dev_server_port);

});


gulp.task('sg:open-server',['sg:server'], function(){
    var options = {
        url: "http://localhost:" + config.server_port + "/" + config.startpage
    };
    gulp.src("./"+ config.build_directory + "/" + config.startpage) // An actual file must be specified or gulp will overlook the task.
        .pipe(notify('Server starting...'))
        .pipe(open("", options));

});


gulp.task('sg:open-server-dev',['sg:server-dev'], function(){
    var options = {
        url: "http://localhost:" + config.dev_server_port + "/" + config.startpage
    };
    gulp.src( config.source_directory + "/" + config.startpage) // An actual file must be specified or gulp will overlook the task.
        .pipe(notify('Dev server starting'))
        .pipe(print())
        .pipe(open("", options));
});


/* run / write - test on your gulp file to see if it works */
gulp.task('test', function(){

    gulp.src("./deploy/index.html") // An actual file must be specified or gulp will overlook the task.
        .pipe(print())
        .pipe(notify('Testing videos'));
});

