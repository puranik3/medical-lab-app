var request = require( 'request' );
const debug = require('debug')('medilab:server:controllers:patients');

var renderView = function( req, res, patients ) {
    res.render('patients', {
        title: 'List of Patients | Medical Lab Management System',
        pageHeader: 'List of Patients',
        patients: patients
    });
};

module.exports = function(req, res, next) {
    var requestOptions = {
        url: global.MediLab.API_BASE_URL + '/patients',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    debug( 'requestOptions = %o', requestOptions );

    request(
        requestOptions,
        function( err, response, patients ) {
            if( err ) {
                debug( 'error retrieving patients %o', err );
                return next();
            }

            debug( 'patients = %o', patients );

            renderView( req, res, patients );
        }
    );
};