/**
 * Build an index of video recordings with MongoDB
 */


(function () {
    "use strict";

    // Root path for directory traversal
    var dir = "N:\\cameras";

    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var walk = require('walk');
    var fs = require('fs');
    var util = require('util');
    var moment = require('moment');
    var xml2js = require('xml2js');
    var options;
    var walker;

    var fileCount = 0;
    var errorCount = 0;

    // test
    var start = new Date().getTime() / 1000;


    /** MongoDB initialize */
    var url = 'mongodb://localhost:27017/openaxis';
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Successfully connected to MongoDB server");
        db.close();
    });

    /** Database: drop collection */
    var dropRecordingsCollection = function(db, callback) {
        db.collection('recordings').drop(function (err, response) {
            //console.log(response);
            callback();
        });
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        dropRecordingsCollection(db, function() {
            db.close();
        });
    });

    /** Database: create recordings index */
    var indexRecordingsCollection = function (db, callback) {
        db.collection('recordings').createIndex(
            {"datetime": 1},
            null,
            function (err, results) {
                console.log(results);
                callback();
            }
        );
    };

    /** Database: insert entry */
    function db_insert(metadata) {
        var datetime = new Date(metadata[3]);

        var insertDocument = function (db, callback) {
            db.collection('recordings').insertOne({
                "camera_id": metadata[0],
                "camera_name": metadata[1],
                "filename": metadata[2],
                "datetime": datetime,
                "path": metadata[4],
                "filesize": metadata[5],
                "triggertype": metadata[6]
            }, function (err, result) {
                assert.equal(err, null);
                console.log("Successfully inserted metadata for file " + metadata[2]);
                callback();
            });
        };

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
                db.close();
            });
        });
    }

    /** Metadata Parser */
    function metadataParser(filename, path, filesize, triggerType) {

        /* Camera name */
        var camera_id = path.split('\\')[2];
        var camera_name = null;

        if (camera_id === '') {
            camera_name = 'front';
        } else if (camera_id === '') {
            camera_name = 'rear';
        }

        /* Date and time */
        var datetime = moment(filename, "YYYYMMDD_HHmmss");

        return [camera_id, camera_name, filename, datetime, path, filesize, triggerType];
    }


    /** Traversal */
    options = {
        followLinks: false,
        filters: ["Skip"]
    };

    walker = walk.walk(dir, options);

    var triggerType = null;

    walker.on("file", function (root, fileStats, next) {
        var filename = fileStats.name;
        var recording_xml = root + "\\recording.xml";

        try {
            if (filename === 'recording.xml') {
                /** Parse XML */
                var parser = new xml2js.Parser();
                fs.readFile(recording_xml, function (err, data) {
                    if (err) {
                        throw err
                    }

                    parser.parseString(data, function (err, result) {
                        if (err) {
                            throw err
                        }

                        triggerType = result['Recording']['CustomAttributes'][0]['TriggerType'][0];
                        fileCount++;
                    });
                });
            }
            else if (filename.substr(filename.lastIndexOf('.')) === '.mkv') {
                //console.log(filename + ' ' + fileStats.size + ' ' + triggerType);
                var fileMetadata = metadataParser(filename, root, fileStats.size, triggerType);
                db_insert(fileMetadata);
                fileCount++;
            }
        } catch (error) {
            //console.log(error);
        } finally {
            next();
        }
    });

    walker.on("errors", function (root, nodeStatsArray, next) {
        errorCount++;
        next();
    });

    walker.on("end", function () {
        /* Call indexRecordingsCollection function */
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            indexRecordingsCollection(db, function() {
                db.close();
            });
        });

        var end = new Date().getTime() / 1000;
        var time = end - start;
        console.log("\nTime: " + time);
        console.log("Indexing of " + fileCount + " files completed with " + errorCount + " errors");
    });
}());