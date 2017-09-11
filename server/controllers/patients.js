module.exports = function(req, res, next) {
    res.render('patients-list', { title: 'List of Patients' });
};