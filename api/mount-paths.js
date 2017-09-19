var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var patientsRouter = require('./routes/patients');
var medicalTestsRouter = require('./routes/medical-tests');

/**
 * app {object} The Express Application object
 */
module.exports = function( app ) {
    app.use('/api', indexRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/patients', patientsRouter);
    app.use('/api/medicaltests', medicalTestsRouter);
};