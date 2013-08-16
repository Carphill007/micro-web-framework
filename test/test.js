var assert = require("assert");
var EmployeeProvider = require('./employeeprovider.js').EmployeeProvider;

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

describe('EmployeeProvider', function(){
	describe('getCollection', function(){
		it('should be empty when there are no employees in the database', function(){
			var employeeProvider= new EmployeeProvider('localhost', 27017);
			employeeProvider.findAll(function(error, emps){
				assert.equal(0, emps.length);
			});
		})
	})
})