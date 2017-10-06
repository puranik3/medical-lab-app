var mongoose = require( 'mongoose' );

var medicalTestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lower_limit: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    upper_limit: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    units: {
        type: String,
        required: true
    }
});

module.exports = {
    schema: medicalTestSchema,
    model: mongoose.model('MedicalTest', medicalTestSchema)    
};