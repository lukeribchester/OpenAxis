var fs = require('fs');
var express = require('express');
var hbs = require('hbs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var schedule = require('node-schedule');

var routes = require('./routes/index');

// connect to mongodb database
var url = 'mongodb://localhost:27017/openaxis';
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB server");
    db.close();
});

// Passport configuration
// configure passport-local strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        db.users.findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (user.password != password) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));

// configure authenticated session persistence
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.users.findById(id, function (err, user) {
        done(err, user);
    });
});

// create express application
var app = express();

// register partials
hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(require('morgan')('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'secret', resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));

// express-messages and connect-flash middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// initialise passport, restore session authentication state
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// file index scheduler
// var j = schedule.scheduleJob('*/5 * * * *', function() {
// });

module.exports = app;
