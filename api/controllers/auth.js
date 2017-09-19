var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var utils = require( '../../utils/utils' );
var jwt = require( '../../auth/jwt' );
var debug = require( 'debug' )( 'medilab:api:controllers:auth' );

module.exports = {
    login: function(req, res, next) {
        let body = req.body;

        debug( '(body.email, body.password) = (%s, %s)', body.email, body.password );
        
        User.findOne(
            {
                email: body.email,
                password: body.password
            },
            function (err, user) {
                if( !user ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.UNAUTHORIZED, "Incorrect login credentials supplied" );
                }
    
                if (err) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }
    
                // henceforth, consider user as logged in if user details present on req.session
                req.session.user = user;

                let payload = {
                    iss: req.hostname,
                    sub: '' + user._id
                };
    
                let token = jwt.encode(payload, 'shhh...');

                res.status( httpStatus.OK ).json({
                    email: body.email,
                    authToken: token
                });
            }
        );
    },
    logout: function(req, res, next) {
        if( req.session ) {
            req.session.destroy(function(err) {
                if (err) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.INTERNAL_SERVER_ERROR, err.message );
                }

                return res.status( httpStatus.OK ).json({
                    "success": true,
                    "message": "user successfully logged out"
                });
            });
        } else {
            return res.status( httpStatus.OK ).json({
                "success": true,
                "message": "user successfully logged out"
            });
        }
    }
};