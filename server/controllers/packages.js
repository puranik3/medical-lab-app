var packages = require( '../../data/packages.json' ).packages;

var renderView = function( req, res ) {
    res.render('packages', {
        title: 'List of Packages | Medical Lab Management System',
        pageHeader: 'List of Packages',
        packages: packages
    });
};

module.exports = function(req, res, next) {
    renderView( req, res );
};