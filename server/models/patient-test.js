var mongoose = require( 'mongoose' );

var patientTestSchema = new mongoose.Schema({
    patient: ObjectId,
    test: ObjectId,
    value: Mixed
});

module.exports = mongoose.model('PatientTest', patientTestSchema);