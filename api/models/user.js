let mongoose = require( 'mongoose' );

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        message: 'Invalid login credentials'
    },
    password: {
        type: String,
        required: true,
        message: 'Invalid login credentials'
    }
});

module.exports = mongoose.model('User', userSchema);