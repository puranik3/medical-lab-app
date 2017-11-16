var request = require( 'request' );
var debug = require('debug')('medilab:server:controllers:patients');
var wlogger = require('../init-logger');

var perPage = 10;

var renderView = function( req, res, patients, count, start, end, page ) {
    res.render('patients', {
        title: 'List of Patients | Medical Lab Management System',
        pageHeader: 'List of Patients',
        patients: patients,
        count: count,
        start: start,
        end: end,
        page: page
    });
};

module.exports = function(req, res, next) {
    var page = req.param('page') || 0;

    var countRequestOptions = {
        url: global.MediLab.API_BASE_URL + '/patients/count',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    debug( 'countRequestOptions = %o', countRequestOptions );

    var requestOptions = {
        url: global.MediLab.API_BASE_URL + '/patients?page=' + page,
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    wlogger.info( 'medilab:server:controllers:patients', 'requestOptions = ', requestOptions );
    debug( 'requestOptions = %o', requestOptions );

    request(
        countRequestOptions,
        function( err, countResponse, count ) {
            if( err ) {
                debug( 'error retrieving count of patients %o', err );
                return next();
            }

            debug( 'count of patients = %o', count );
            request(
                requestOptions,
                function( err, response, patients ) {
                    if( err ) {
                        wlogger.info( 'medilab:server:controllers:patients', 'error retrieving patients = ', JSON.stringify( err ) );
                        debug( 'error retrieving patients %o', err );
                        return next();
                        /*
                        res.render('patients', {
                            title: 'List of Patients | Medical Lab Management System',
                            pageHeader: JSON.stringify( err ) + JSON.stringify( requestOptions ),
                            patients: []
                        });
                        */
                    }

                    wlogger.info( 'medilab:server:controllers:patients', 'patients = ', JSON.stringify( patients ) );
                    debug( 'patients = %o', patients );

                    var start = +page * perPage + 1;
                    var end = Math.min( (+page + 1 ) * perPage, +count.documents );
        
                    debug( 'patients = %o', patients, count, start, end, page );
        
                    renderView( req, res, patients, count, start, end, page );
                }
            );
        }
    );
};