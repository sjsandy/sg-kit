/**
 * Created by studio-mac on 6/8/14.
 */


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

