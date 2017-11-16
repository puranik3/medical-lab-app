var mongoose = require( 'mongoose' );
var httpStatus = require( 'http-status' );

var User = mongoose.model( 'User' );
var utils = require( '../../utils/utils' );



module.exports = {
    find: function(req, res, next) {
        var perPage = 10, page = req.param('page')

        var query = User
            .find()
            .sort( 'email' )

        if( page ) {
            query
                .limit( perPage )
                .skip( perPage * page )
        }

        query.exec(function( err, users ) {
            if( !users ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, "Users not found" );
            }

            if( err ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
            }

            res.status( httpStatus.OK ).json( users );
        });
    },
    findById : function(req, res, next) {
        var userId = ( req.params && req.params.userId ) || 0;
        
        if( !userId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, "User id missing in request" );
        }

        User
            .findById( req.params.userId)
            .exec(function( err, users ) {
                if( !users ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, "User with given id not found" );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                res.status( httpStatus.OK ).json( users );
            });
    },
    create: function(req, res, next) {
        var user = req.body;
        if( !user ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, "User details not present in request body" );
        }

        User
            .create( user, function( err, user ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                }

                return res.status(httpStatus.OK).json( user );
            });
    },
    updateById: function(req, res, next) {
        res.send('@todo: Update details of user with given id');
    },
    deleteById: function(req, res, next) {
        res.send('@todo: Delete user with given id');
    }
};