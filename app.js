var compression = require('compression')

var express = require('express');
var app = express();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// compress all responses
app.use(compression())

// set up Cors.
var cors = require('cors')
app.use(cors())

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var mongoose = require('mongoose')

let MONGODB_URI = "mongodb://localhost:27017/"
MONGODB_URI = MONGODB_URI + "userSessions"

console.log("process.env.IS_HEROKU is : " + process.env.IS_HEROKU)
console.log("process.env.MONGODB_URI " + process.env.MONGODB_URI)

if (process.env.IS_HEROKU == "true"){
   MONGODB_URI = process.env.MONGODB_URI
    console.log("Inside the IF process.env.MONGODB_URI " + process.env.MONGODB_URI)
}
var MongoDBStore = require('connect-mongodb-session')(session);

MONGODB_URI = MONGODB_URI + "userSessions"

//var store = mongoose.connect(MONGODB_URI)

    //uri: 'mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj',
var store = new MongoDBStore({
    uri: 'mongodb://heroku_ptln6dnj:vi22d3nuk65m1ktjqrtjalvnku@ds111492.mlab.com:11492/heroku_ptln6dnj',
    collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
   console.log("Info : app.js : Failed to connect to MongoDB  => " + error)  
    console.log(error);
});
 
app.use(require('express-session')({
  secret: 'whatever',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('public', express.static(path.join(__dirname, 'public')));
app.set('images', express.static(path.join(__dirname, 'images')));
app.set('stylesheets', express.static(path.join(__dirname, 'stylesheets')));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
