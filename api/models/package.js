var mongoose = require( 'mongoose' );

var packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    discountAmount: Number,
    discountStrategy: {
        type: String,
        enum: {
            values: ['percentage', 'absolute'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    tests: [mongoose.Schema.ObjectId]
});

module.exports = {
    schema: packageSchema,
    model: mongoose.model('Package', packageSchema)
};