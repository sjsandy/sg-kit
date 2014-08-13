/* require dependencies */

require('./gulp');

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
var sequence = require('run-sequence');
var grunt = require('gulp-grunt');
var inject = require('gulp-inject');
var bower = require('gulp-bower-files');
var browserify = require('browserify');
var filter = require('gulp-filter');
var config = require("./config.json");
var open = require('gulp-open');
var notify = require('gulp-notify');
var sync = require('browser-sync');
var prompt = require('gulp-prompt');

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
var layout_dir = 'test';
var srcDir = config.source_directory;
var scriptsPath = srcDir + 'js/';
var buildPath = config.build_directory,
    livereloadport = config.live_reload_port,
    serverport = config.server_port,
    sync_files = [ "./" + config.build_directory + "css/*.css", config.build_directory + "js/*.js", config.build_directory + "**.html"],
    sync_files_dev = [ config.source_directory + "**/*.css", config.source_directory + "**/*.js", config.source_directory + "**/*.html" ],
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
    gulp.src([ srcDir + file_dir + '**/*.*', srcDir + 'data/**/*.json'],{ base: './app/js' })
        .pipe(changed(buildPath + file_dir))
        .pipe(gulp.dest(buildPath + file_dir))
        .pipe(print());

});

/* copy html files to the build */
gulp.task('html', function () {
    //collect all files in root di
    //move to dest folder
    gulp.src([srcDir + '/*', srcDir + '/**/*.html'])
        .pipe(gulp.dest(buildPath))
        .pipe(print());
});


/* copy images to build */
gulp.task('images', function () {

    var file_dir = 'images/';
    var images = [srcDir + '**/*.jpg',srcDir + '**/*.png',srcDir + '**/*.gif', srcDir + 'images/**.*', srcDir + 'img/**.*'];
    gulp.src(images, { base: './app/'+ file_dir })
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
        'sg:server',
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
        gulp.src(['./bower_components/fontawesome/css/**/*.*', './bower_components/fontawesome/fonts/**/*.*'], { base: './bower_components/' })
            .pipe(gulp.dest(srcDir + 'fonts/'))
            .pipe(print())
    )
})


/* copy bower files into your src/ app directory */
gulp.task('sg:start', function(){
    sequence(
        'clean:vendor',
        ['sg:setup'],
        "sg:server-dev"
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

    sync.init([ "./" + config.build_directory + "css/*.css", config.build_directory + "js/*.js", config.build_directory + "**/*.html"], {
        server: {
            baseDir: config.build_directory
        },
        startPath: config.startpage
    });

});


/* start the development server */
gulp.task('sg:server-dev', function(){

    sync.init(sync_files_dev, {
        server: {
            baseDir: config.source_directory
        },
        startPath: config.startpage
    });

});

gulp.task('gulp:layout', function(){

   return gulp.src(buildPath , { read : false })
        .pipe(prompt.prompt({
            type: 'input',
            name: 'layout',
            message: 'Enter the layout folders name'

        }, function(res){
            layout_dir = res.layout;
        })

);


});

gulp.task('create:layout',['gulp:layout'], function(){
    gulp.src(buildPath + '**/*.*')
        .pipe(changed('layouts/' + layout_dir))
        .pipe(gulp.dest('layouts/' + layout_dir))
        .pipe(print())
        //.pipe(notify('Your new layout,' + layout_dir + ' has been created'));
});


