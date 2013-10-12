var express = require('express')
  //, routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider.js').EmployeeProvider
  , ConnectionManager = require('./connectionmanager.js').ConnectionManager;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', './views');
  
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
		// the status option, or res.statusCode = 404
		// are equivalent, however with the option we
		// get the "status" local available as well
		res.render('404', { status: 404, url: req.url });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var connectionManager = new ConnectionManager('localhost', 27017);
var employeeProvider= new EmployeeProvider(connectionManager);

//Routes

app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps
        });
  });
});

app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
        employeeProvider.findById(req.param('_id'), function(error, employee) {
                res.render('employee_edit',
                { 
                        employee: employee
                });
        });
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
        employeeProvider.update(req.param('_id'),{
                title: req.param('title'),
                name: req.param('name')
        }, function(error, docs) {
                res.redirect('/')
        });
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
        employeeProvider.delete(req.param('_id'), function(error, docs) {
                res.redirect('/')
        });
});

app.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
    });
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact'
    });
});


app.listen(3000);