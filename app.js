var express = require('express');
var session = require('express-session');
var MongoStore = require( 'connect-mongo' )( session );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var wlogger = require( './server/init-logger' );

//console.log( path.resolve(__dirname, 'medilab-app.log') );
//winston.add(winston.transports.File, { filename: path.resolve(__dirname, 'medilab-app.log') });
wlogger.info('Hello world');

var auth = require( './auth/auth' );

var mountPathsApp = require( './server/mount-paths' );
var mountPathsApi = require( './api/mount-paths' );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'jade');

// log requests and responses using morgan
if( MediLab.environment === 'production' ) {
  // use combined preset, see https://github.com/expressjs/morgan#combined
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('shhh...'));
app.use(session({
  secret: 'shhh...',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 },
  store: new MongoStore({
      url: global.MediLab.DB_URI
  })
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// setup authentication
auth.setupAuth(app);

// mount routes for App and API
mountPathsApp(app);
mountPathsApi(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // @todo Change this to selectively allow for specific environments instead
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;