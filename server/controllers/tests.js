var request = require( 'request' );
var debug = require('debug')('medilab:server:controllers:patients');

var renderView = function( req, res, tests ) {
    res.render('tests', {
        title: 'List of Medical Tests | Medical Lab Management System',
        pageHeader: 'List of Medical Tests',
        tests: tests
    });
};

module.exports = function(req, res, next) {
    var requestOptions = {
        url: global.MediLab.API_BASE_URL + '/medicaltests',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    debug( 'requestOptions = %o', requestOptions );

    request(
        requestOptions,
        function( err, response, tests ) {
            if( err ) {
                debug( 'error retrieving tests %o', err );
                return next();
            }

            debug( 'tests = %o', tests );

            renderView( req, res, tests );
        }
    );
};