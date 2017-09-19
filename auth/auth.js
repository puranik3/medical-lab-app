var httpStatus = require( 'http-status' );
var utils = require( '../utils/utils' );
var jwt = require( './jwt' );
var debug = require( 'debug' )( 'medilab:auth:auth' );

module.exports.setupAuth = function( app ) {
    function authenticate( req, res, next ) {
        function sendUnauthorizedAccessMessage() {
            return utils.sendJsonErrorResponse( req, res, httpStatus.UNAUTHORIZED, 'You are not authorized to view this' );
        }

        // check if authentication cookie exists and move onto next middleware if so. if not check for JWT's existence
        debug( 'session cookies = %O', req.session.user );
        if( req.session.user ) {
            debug( 'Cookie-based authentication succeeded' );
            return next();
        }

        // endpoints which don't require authentication
        if ( req.path === '/login' || req.path === '/api/auth/login' ) {
            debug( 'Request was for an unauthenticated endpoint' );
            return next();
        }

        // check if authorization header missing
        if (!req.headers.authorization) {
            return sendUnauthorizedAccessMessage();
        }

        // check if authorization token is valid
        let token = req.headers.authorization.split(' ')[1];
        
        let payload;
        try {
            payload = jwt.decode(token, 'shhh...');
        } catch (err) {
            return sendUnauthorizedAccessMessage();
        }

        if (!payload || !payload.sub) {
            return sendUnauthorizedAccessMessage();
        }

        res.locals.payload = payload;

        debug( 'JWT-based authentication succeeded' );

        next();
    }

    // set up authentication for routes
    app.all('*', authenticate);
};