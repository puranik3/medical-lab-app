var mongoose = require( 'mongoose' );

var patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    age: {
        type: Number,
        min: 0
    },
    sex: {
        type: String,
        enum: {
            values: ['male', 'female', 'other', 'unspecified'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    contact: {
        emails: {
            // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
            type: [String],
            validate: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        },
        phones: [String]
    }
});

module.exports = mongoose.model('Patient', patientSchema);