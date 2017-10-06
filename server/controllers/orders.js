var request = require( 'request' );
var debug = require('debug')('medilab:server:controllers:orders');
var wlogger = require('../init-logger');

var renderView = function( req, res, orders ) {
    res.render('orders', {
        title: 'List of Orders | Medical Lab Management System',
        pageHeader: 'List of Orders',
        orders: orders
    });
};

module.exports = function(req, res, next) {
    var requestOptions = {
        url: global.MediLab.API_BASE_URL + '/orders',
        method: 'GET',
        headers: req.headers, // pass on headers received when making an API call
        json: {}
    };

    wlogger.info( 'medilab:server:controllers:orders', 'requestOptions = ', requestOptions );
    debug( 'requestOptions = %o', requestOptions );

    request(
        requestOptions,
        function( err, response, orders ) {
            if( err ) {
                wlogger.info( 'medilab:server:controllers:orders', 'error retrieving orders = ', JSON.stringify( err ) );
                debug( 'error retrieving orders %o', err );
                return next();
                /*
                res.render('orders', {
                    title: 'List of Orders | Medical Lab Management System',
                    pageHeader: JSON.stringify( err ) + JSON.stringify( requestOptions ),
                    orders: []
                });
                */
            }

            wlogger.info( 'medilab:server:controllers:orders', 'orders = ', JSON.stringify( orders ) );
            debug( 'orders = %o', orders );

            renderView( req, res, orders );
        }
    );
};