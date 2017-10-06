var mongoose = require( 'mongoose' );
var testSchema = require( './medical-test' ).schema;

var reportSchema = new mongoose.Schema({
    test: testSchema,
    result: mongoose.Schema.Types.Mixed
});

var orderSchema = new mongoose.Schema({
    patientId: mongoose.Schema.ObjectId,
    tests: [mongoose.Schema.ObjectId],
    packages: [mongoose.Schema.ObjectId],
    _status: {
        type: String,
        enum: {
            values: ['created', 'initiated', 'completed', 'closed'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    createdDate: Date,
    lastModifiedDate: Date,
    report: {
        _status: {
            type: String,
            enum: {
                values: ['uninitiated', 'initiated', 'completed'],
                message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
            }
        },
        results: [reportSchema],
        createdDate: Date,
        lastModifiedDate: Date
    }
});

module.exports = {
    schema: orderSchema,
    model: mongoose.model('Order', orderSchema) 
};