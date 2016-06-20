var express = require('express');
var router = express.Router();
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');
var moment = require('moment');
var mongoose = require('mongoose');
var _ = require('underscore');

var Recordings = require(__dirname + '/../models/recordings.js').Recordings;


/* GET root page. */
router.get('/', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/live', {title: 'Live', user: req.user});
});

/* GET live page. */
router.get('/live', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/live', {title: 'Live', user: req.user});
});

/* GET events page. */
router.get('/events', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/events', {title: 'Events', user: req.user});
});







/* GET archive page. */
router.get('/archive',
    function (req, res, next) {

    // test
    var weekOfYearIso = moment().isoWeek();
    var weekOfYearIsoRange = _.range(weekOfYearIso - 3, weekOfYearIso + 1).reverse();

    var daysOfWeekIsoRange = [];
    for (var i = 1; i < 8; i++) {
        var day = [];
        day.push(moment().isoWeekday(i).format("ddd"));
        day.push(moment().isoWeekday(i).format("Do"));

        daysOfWeekIsoRange.push(day);
    }

    // current year
    var currentYear = moment().format("GGGG");
    // current week
    var currentWeek = moment().format("WW");
    // current day
    var currentDay = moment().format("DD");
    // current hour
    var currentHour = moment().format("HH");
    console.log("------------------" + currentYear);

    res.render('./pages/archive', {
        title: 'Archive',
        user: req.user,
        year: currentYear,
        week: currentWeek,
        day: currentDay,
        hour: currentHour,
        weekOfYearIsoRange: weekOfYearIsoRange,
        daysOfWeekIsoRange: daysOfWeekIsoRange
    });
});








/* GET settings page. */
router.get('/settings', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/settings', {title: 'Settings', user: req.user});
});

/* GET license page. */
router.get('/license', function (req, res, next) {
    res.render('./pages/license', {title: 'License', user: req.user});
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('./pages/login', {title: 'Sign in', user: req.user});
});

/* POST login page. */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));


/* GET logout page. */
router.get('/logout', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    req.logout();
    res.redirect('/login');
});

/* GET test page. */
router.get('/test', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/test', {title: 'Test', user: req.user});
});

module.exports = router;
