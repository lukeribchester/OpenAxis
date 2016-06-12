var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/openaxis_test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to MongoDB server.");
    db.close();
});

/* GET root page. */
router.get('/', function (req, res, next) {
    res.render('./pages/live', {title: 'Live'});
});

/* GET live page. */
router.get('/live', function (req, res, next) {
    res.render('./pages/live', {title: 'Live'});
});

/* GET events page. */
router.get('/events', function (req, res, next) {
    res.render('./pages/events', {title: 'Events'});
});

/* GET archive page. */
router.get('/archive', function (req, res, next) {
    res.render('./pages/archive', {title: 'Archive'});
});

module.exports = router;
