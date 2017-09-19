var mongoose = require( 'mongoose' );

var patientTestSchema = new mongoose.Schema({
    patient: mongoose.Schema.ObjectId,
    test: mongoose.Schema.ObjectId,
    resultant: mongoose.Schema.Mixed
});

module.exports = mongoose.model('PatientTest', patientTestSchema);