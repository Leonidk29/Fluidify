// Dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const config = require('./config');
const plotly = require('plotly')(config.plotly.name, config.plotly.token);


//==============================================================================

// Import routes
const index = require('./routes/index');




//==============================================================================

// Database Settings
const debug = require('debug')('metering-project:server');
const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);
const mongoDB = config.mongo_url;

// database connection
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    debug("Connected to db successfully!")
});


//==============================================================================

// App instance
const app = express();

//==============================================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//==============================================================================

// Favicon and other stuff
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//==============================================================================

// Session settings and auth settings
app.use(expressSession({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

const Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//==============================================================================


// Use routes
app.use('/', index);

// Start mock to get water consumption
const mock = require('./worker/mockstream');
mock.startMockStream();


//==============================================================================


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
