module.exports.setup = function(app, employeeProvider){
    //Routes
    app.get('/', function(req, res){
      res.render('index', {
                title: 'Home'
      });
    });


    app.get('/employee/list', 
      function(req, res){  
        employeeProvider.findAll(function(error, emps){
        res.render('employee_list', {
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
};
