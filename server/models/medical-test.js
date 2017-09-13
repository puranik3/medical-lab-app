var mongoose = require( 'mongoose' );

var medicalTestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    limits: {
        lower: {
            type: Mixed,
            required: false
        },
        upper: {
            type: Mixed,
            required: false
        }
    },
    units: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('MedicalTest', medicalTestSchema);