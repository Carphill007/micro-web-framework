var express = require('express')
  //, routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider.js').EmployeeProvider
  , ConnectionManager = require('./connectionmanager.js').ConnectionManager
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , flash = require('connect-flash');
  
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/* passport.use(new TwitterStrategy({
    consumerKey: 'QfgNILJPVEMpasuDA4wCA',
    consumerSecret: 'tTxaM24qDea2sCrgCpMgRMKpxSr8F0QT6uEdqP8iNvE',
    callbackURL: ""
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
)); */

var app = express();

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
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
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
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var connectionManager = new ConnectionManager('localhost', 27017);
var employeeProvider= new EmployeeProvider(connectionManager);

//Routes
app.get('/', function(req, res){
  res.render('index', {
            title: 'Home'
  });
});


app.get('/employee/list', function(req, res){
  employeeProvider.findAll(function(error, emps){
	  res.render('employee_list', {
            title: 'Employees',
            employees:emps
        });
  });
});

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

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
        res.redirect('/employee/list')
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
                res.redirect('/employee/list')
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