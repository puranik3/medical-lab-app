var packages = require( '../../data/package.json' ).packages;

module.exports = function(req, res, next) {
    res.render('packages', {
        title: 'List of Packages | Medical Lab Management System',
        pageHeader: 'List of Packages',
        packages: packages
    });
};