var tests = require( '../../data/medical-test.json' ).tests;

module.exports = function(req, res, next) {
    res.render('tests', {
        title: 'List of Test | Medical Lab Management System',
        pageHeader: 'List of Tests',
        tests: tests
    });
};