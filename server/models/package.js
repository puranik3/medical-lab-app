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
        required: true
    },
    discount: {
        amount: Number,
        strategy: {
            type: String,
            enum: {
                values: ['percentage', 'absolute'],
                message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
            }
        }
    },
    tests: [ObjectId]
});

module.exports = mongoose.model('Package', packageSchema);