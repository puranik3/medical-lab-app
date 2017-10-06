var mongoose = require( 'mongoose' );

var patientTestResultSchema = new mongoose.Schema({
    test: mongoose.Schema.ObjectId,
    result: mongoose.Schema.Types.Mixed
});

var reportSchema = new mongoose.Schema({
    orderId: mongoose.Schema.ObjectId,
    tests: [mongoose.Schema.ObjectId],
    packages: [mongoose.Schema.ObjectId],
    _status: {
        type: String,
        enum: {
            values: ['created', 'initiated', 'completed', 'closed'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    testResults: [patientTestResultSchema]
});

module.exports = {
    schema: reportSchema,
    model: mongoose.model('Report', reportSchema)
};