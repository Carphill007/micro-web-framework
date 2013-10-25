var express = require('express')
var app = express();

module.exports.setup = function(options){

  var http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider.js').EmployeeProvider
  , AnalyticsProvider = require('./analyticsprovider.js').AnalyticsProvider
  , ConnectionManager = require('./connectionmanager.js').ConnectionManager
  , DBProvider = require('./dbprovider.js').DBProvider
  , routes = require('./routes.js');

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', './views');
    
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'SECRET' }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '../public'));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(function(req, res, next){
  		// the status option, or res.statusCode = 404
  		// are equivalent, however with the option we
  		// get the "status" local available as well
  		res.render('404', { status: 404, url: req.url });
    });
    app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
  	  res.render('500', {
  		  status: err.status || 500
  		, error: err
  	  });
    });
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  var connectionManager = new ConnectionManager('localhost', 27017);
  var openddb = new DBProvider(connectionManager);
  var employeeProvider= new EmployeeProvider(openddb);
  var analyticsProvider= new AnalyticsProvider(openddb);

  routes.setup(app, employeeProvider, analyticsProvider);
};

module.exports.listen = function()
{
  console.log('Listening on port ' + app.get('port'));
  return app.listen(app.get('port'));
}