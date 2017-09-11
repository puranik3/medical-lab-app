module.exports = function(req, res, next) {
    res.render('patients', {
        title: 'List of Patients | Medical Lab Management System',
        pageHeader: 'List of Patients',
        patients: [
            {
                name: "Ilanko",
                age: 34,
                sex: "Male",
                contact: {
                    phones: [ 9448441476, 9448441477 ]
                }
            },
            {
                name: "Prashanth",
                age: 36,
                sex: "Male",
                contact: {
                    phones: [ 9448441478 ]
                }
            },
            {
                name: "Mary",
                age: 28,
                sex: "Female",
                contact: {
                    phones: [ 9448441479 ]
                }
            }
        ]
    });
};