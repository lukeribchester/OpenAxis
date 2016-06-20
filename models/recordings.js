'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordingSchema = new Schema({
    camera_id: String,
    camera_name: String,
    filename: String,
    datetime: Date,
    path: String,
    filesize: Number,
    triggertype: String
});

var Recordings = mongoose.model('recording', recordingSchema);

exports.Recordings = Recordings;