var debug = require( 'debug' )( 'medilab:server:controllers:index' );

var renderView = function( req, res ) {
    debug( 'renderView() of index page' );
    
    res.render('generic', {
        title: 'Medical Lab Management System',
        pageHeader: 'Medical Lab Management System',
        pageBody: `Medical lab app helps labs maintain patient information &amp; information regarding lab tests, packages and reports online.`
    });
};

module.exports = function(req, res, next) {
    renderView( req, res );
};