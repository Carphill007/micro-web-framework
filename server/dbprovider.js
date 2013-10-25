var util = require('util');

module.exports.DBProvider = function(connectionManager) {
   this.db = connectionManager.db;
   this.db.open(function(){});
};