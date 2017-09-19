var request = require( 'request' );
var debug = require('debug')('medilab:server:controllers:patients');
var wlogger = require('../init-logger');

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

    wlogger.info( 'medilab:server:controllers:patients', 'requestOptions = ', requestOptions );
    debug( 'requestOptions = %o', requestOptions );

    request(
        requestOptions,
        function( err, response, patients ) {
            if( err ) {
                wlogger.info( 'medilab:server:controllers:patients', 'error retrieving patients = ', JSON.stringify( err ) );
                debug( 'error retrieving patients %o', err );
                //return next();
                res.render('patients', {
                    title: 'List of Patients | Medical Lab Management System',
                    pageHeader: JSON.stringify( err ) + JSON.stringify( requestOptions ),
                    patients: []
                });
            }

            wlogger.info( 'medilab:server:controllers:patients', 'patients = ', JSON.stringify( patients ) );
            debug( 'patients = %o', patients );

            renderView( req, res, patients );
        }
    );
};