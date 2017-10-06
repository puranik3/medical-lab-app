var aboutRouter = require('./routes/about');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var ordersRouter = require('./routes/orders');
var packagesRouter = require('./routes/packages');
var patientsRouter = require('./routes/patients');
var testsRouter = require('./routes/tests');
var usersRouter = require('./routes/users');

/**
 * app {object} The Express Application object
 */
module.exports = function( app ) {
    app.use('/', indexRouter);
    app.use('/login', loginRouter);
    app.use('/about', aboutRouter);
    app.use('/orders', ordersRouter);
    app.use('/packages', packagesRouter);
    app.use('/patients', patientsRouter);
    app.use('/tests', testsRouter);
    app.use('/users', usersRouter);
};