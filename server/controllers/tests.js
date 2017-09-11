module.exports = function(req, res, next) {
    res.render('tests', {
        title: 'List of Test | Medical Lab Management System',
        pageHeader: 'List of Tests',
        tests: [
            {
                name: 'Fasting Blood Sugar (FBS)',
                lower_limit: 70,
                upper_limit: 110,
                units: 'mg/dl'
            },
            {
                name: 'Urine Sugar (US)',
                lower_limit: 40,
                upper_limit: 80,
                units: 'mg/dl'
            },
            {
                name: 'Blood Pressure (Systolic)',
                lower_limit: 70,
                upper_limit: 150,
                units: 'bpm'
            },
            {
                name: 'Blood Pressure (Diastolic)',
                lower_limit: 50,
                upper_limit: 120,
                units: 'bpm'
            }
        ]
    });
};