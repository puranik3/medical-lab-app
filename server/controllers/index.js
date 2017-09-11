module.exports = function(req, res, next) {
    res.render('generic', {
        title: 'Medical Lab Management System',
        pageHeader: 'Medical Lab Management System',
        pageBody: `Medical lab app helps labs maintain patient information &amp; information regarding lab tests, packages and reports online.`
    });
};