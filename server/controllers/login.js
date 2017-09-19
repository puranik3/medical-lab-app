var debug = require( 'debug' )( 'medilab:server:controllers:login' );

var renderView = function( req, res ) {
    res.render('login', {
        title: 'Login'
    });
    debug( 'after login view render' );
};

module.exports = function(req, res, next) {
    renderView( req, res );
};