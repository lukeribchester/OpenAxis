var express = require('express');
var router = express.Router();
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');

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
router.get('/archive', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/archive', {title: 'Archive', user: req.user});
});

/* GET settings page. */
router.get('/settings', connectEnsureLogin.ensureLoggedIn('/login'),
    function (req, res, next) {
    res.render('./pages/settings', {title: 'Settings', user: req.user});
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
