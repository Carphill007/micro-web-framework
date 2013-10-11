var assert = require("assert");
var sinon = require("sinon");
var ConnectionManager = require('../connectionmanager.js').ConnectionManager;
var EmployeeProvider = require('../employeeprovider.js').EmployeeProvider;

describe('EmployeeProvider', function(){
	describe('getCollection', function(){
		it('should be empty when there are no employees in the database', function(){
			//var connectionManager = new ConnectionManager('localhost', 27017);
			
			var employeeProvider= new EmployeeProvider(connectionManager);
			employeeProvider.findAll(function(error, emps){
				assert.equal(0, emps.length);
			});
		})
	})
})