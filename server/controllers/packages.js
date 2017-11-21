var request = require( 'request' );
var async = require( 'async' );
var debug = require('debug')('medilab:server:controllers:packages');
var wlogger = require('../init-logger');

var perPage = 10;

var renderView = function( req, res, packages, tests, count, start, end, page ) {
    res.render('packages', {
        title: 'List of Packages | Medical Lab Management System',
        pageHeader: 'List of Packages',
        packages: packages,
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
        url: global.MediLab.API_BASE_URL + '/packages/count',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    debug( 'countRequestOptions = %o', countRequestOptions );

    var requestOptionsPackages = {
        url: global.MediLab.API_BASE_URL + '/packages?page=' + page,
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    var requestOptionsMedicalTests = {
        url: global.MediLab.API_BASE_URL + '/medicaltests',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    wlogger.info( 'medilab:server:controllers:packages', 'requestOptionsPackages = ', requestOptionsPackages );
    debug( 'requestOptionsPackages = %o', requestOptionsPackages );

    request(
        countRequestOptions,
        function( err, countResponse, count ) {
            if( err ) {
                debug( 'error retrieving count of packages %o', err );
                return next();
            }

            debug( 'count of packages = %o', count );

            // an example using an object instead of an array
            async.parallel({
                packages: function(callback) {
                    request(
                        requestOptionsPackages,
                        function( err, response, packages ) {
                            if( err ) {
                                return callback( err );
                            } else {
                                return callback( null, packages );
                            }

                            /*
                            if( err ) {
                                wlogger.info( 'medilab:server:controllers:packages', 'error retrieving packages = ', JSON.stringify( err ) );
                                debug( 'error retrieving packages %o', err );
                                return next();
                            }
                
                            wlogger.info( 'medilab:server:controllers:packages', 'packages = ', JSON.stringify( packages ) );
                            debug( 'packages = %o', packages );
                            */
                        }
                    );
                },
                tests: function(callback) {
                    request(
                        requestOptionsMedicalTests,
                        function( err, response, tests ) {
                            if( err ) {
                                return callback( err );
                            } else {
                                return callback( null, tests );
                            }
                            /*
                            if( err ) {
                                wlogger.info( 'medilab:server:controllers:packages', 'error retrieving tests = ', JSON.stringify( err ) );
                                debug( 'error retrieving tests %o', err );
                                return next();
                            }
                
                            wlogger.info( 'medilab:server:controllers:packages', 'tests = ', JSON.stringify( tests ) );
                            debug( 'packages = %o', packages );
                            */
                        }
                    );
                }
            }, function(err, results) {
                if( err ) {
                    wlogger.info( 'medilab:server:controllers:packages', 'error retrieving packages/tests = ', JSON.stringify( err ) );
                    debug( 'error retrieving packages/tests %o', err );
                    return next();
                }

                wlogger.info( 'medilab:server:controllers:packages', 'packages = ,', JSON.stringify( results.packages ), '  tests = ', JSON.stringify( results.tests ) );
                debug( 'results.packages = %o', results.packages );
                debug( 'results.tests = %o', results.tests );

                var start = +page * perPage + 1;
                var end = Math.min( (+page + 1 ) * perPage, +count.documents );
    
                debug( 'packages = %o', results.packages, count, start, end, page );

                renderView( req, res, results.packages, results.tests, count, start, end, page );
            });
        }
    );
};