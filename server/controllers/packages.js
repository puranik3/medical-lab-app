module.exports = function(req, res, next) {
    res.render('packages', {
        title: 'List of Packages | Medical Lab Management System',
        pageHeader: 'List of Packages',
        packages: [
            {
                name: 'Cardiology',
                price: 1100,
                currency: 'INR',
                discount: {
                    amount: 20,
                    type: 'percentage'
                },
                tests: [
                    {
                        name: 'Blood Pressure (Systolic)'
                    },
                    {
                        name: 'Blood Pressure (Diastolic)'
                    }
                ]
            },
            {
                name: 'Diabetes',
                price: 200,
                currency: 'INR',
                discount: {
                    amount: 30,
                    type: 'currency'
                },
                tests: [
                    {
                        name: 'Fasting Blood Sugar (FBS)'
                    },
                    {
                        name: 'Urine Sugar (US)'
                    }
                ]
            }
        ]
    });
};