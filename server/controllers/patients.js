var patients = require( '../../data/patient.json' ).patients;

module.exports = function(req, res, next) {
    res.render('patients', {
        title: 'List of Patients | Medical Lab Management System',
        pageHeader: 'List of Patients',
        patients: patients
    });
};