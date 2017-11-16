var request = require( 'request' );
var debug = require('debug')('medilab:server:controllers:patients');

var perPage = 10;

var renderView = function( req, res, tests, count, start, end, page ) {
    res.render('tests', {
        title: 'List of Medical Tests | Medical Lab Management System',
        pageHeader: 'List of Medical Tests',
        tests: tests,
        count: count,
        start: start,
        end: end,
        page: page
    });
};

module.exports = function(req, res, next) {
    var page = req.param('page') || 0;

    var countRequestOptions = {
        url: global.MediLab.API_BASE_URL + '/medicaltests/count',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    debug( 'countRequestOptions = %o', countRequestOptions );

    var requestOptions = {
        url: global.MediLab.API_BASE_URL + '/medicaltests?page=' + page,
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    debug( 'requestOptions = %o', requestOptions );

    request(
        countRequestOptions,
        function( err, countResponse, count ) {
            if( err ) {
                debug( 'error retrieving count of tests %o', err );
                return next();
            }

            debug( 'count of tests = %o', count );

            request(
                requestOptions,
                function( err, response, tests ) {
                    if( err ) {
                        debug( 'error retrieving tests %o', err );
                        return next();
                    }

                    var start = +page * perPage + 1;
                    var end = Math.min( (+page + 1 ) * perPage, +count.documents );
        
                    debug( 'tests = %o', tests, count, start, end, page );
        
                    renderView( req, res, tests, count, start, end, page );
                }
            );
        }
    );
};