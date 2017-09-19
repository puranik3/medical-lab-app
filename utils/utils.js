var debug = require( 'debug' )( 'utils:utils' );

function sendJsonErrorResponse( req, res, statusCode, message ) {
    debug( 'statusCode = %s, errMessage = %s', statusCode, message );
    return res.status(statusCode).json({
        "message": message
    });
}

module.exports = { sendJsonErrorResponse };