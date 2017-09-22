var request = require( 'request' );
var debug = require('debug')('medilab:server:controllers:packages');
var wlogger = require('../init-logger');

var renderView = function( req, res, packages ) {
    res.render('packages', {
        title: 'List of Packages | Medical Lab Management System',
        pageHeader: 'List of Packages',
        packages: packages
    });
};

module.exports = function(req, res, next) {
    var requestOptions = {
        url: global.MediLab.API_BASE_URL + '/packages',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    wlogger.info( 'medilab:server:controllers:packages', 'requestOptions = ', requestOptions );
    debug( 'requestOptions = %o', requestOptions );

    request(
        requestOptions,
        function( err, response, packages ) {
            if( err ) {
                wlogger.info( 'medilab:server:controllers:packages', 'error retrieving packages = ', JSON.stringify( err ) );
                debug( 'error retrieving packages %o', err );
                return next();
            }

            wlogger.info( 'medilab:server:controllers:packages', 'packages = ', JSON.stringify( packages ) );
            debug( 'packages = %o', packages );

            renderView( req, res, packages );
        }
    );
};