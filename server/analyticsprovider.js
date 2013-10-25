var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AnalyticsProvider = function(opendb) {
  this.db = opendb.db;
};


AnalyticsProvider.prototype.getCollection= function(callback) {
  this.db.collection('analytics', function(error, analytic_collection) {
    if( error ) callback(error);
    else callback(null, analytic_collection);
  });
};

//find all analytics
AnalyticsProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, analytic_collection) {
      if( error ) callback(error)
      else {
        analytic_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else {
            console.log('found analytics: ' + results.length)
            callback(null, results)
          }
        });
      }
    });
};

//save new analytic
AnalyticsProvider.prototype.save = function(analytics, callback) {
    this.getCollection(function(error, analytic_collection) {
      if( error ) callback(error)
      else {
        if( typeof(analytics.length)=="undefined")
          analytics = [analytics];

        for( var i =0;i< analytics.length;i++ ) {
          analytic = analytics[i];
        }

        analytic_collection.insert(analytics, function() {
          callback(null, analytics);
        });
      }
    });
};

// update an analytic
AnalyticsProvider.prototype.update = function(analytic_name, analytics, callback) {
    this.getCollection(function(error, analytic_collection) {
      if( error ) callback(error);
      else {
        analytic_collection.update(
            {_name: analytic_collection.db.bson_serializer.ObjectID.createFromHexString(name)},
            analytics,
            function(error, analytics) {
                if(error) callback(error);
                else callback(null, analytics)       
            });
      }
    });
};


exports.AnalyticsProvider = AnalyticsProvider;