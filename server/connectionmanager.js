var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ConnectionManager = function(host, port) {
  this.db= new Db('node-mongo-employee', new Server(host, port), {w: 1});
};

exports.ConnectionManager = ConnectionManager;