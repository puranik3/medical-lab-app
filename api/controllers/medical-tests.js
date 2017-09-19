var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var MedicalTest = mongoose.model( 'MedicalTest' );
var utils = require( '../../utils/utils' );
var debug = require( 'debug' )( 'medilab:api:controllers:medical-tests' );

module.exports = {
    find: function(req, res, next) {
        debug( 'start find()' );
        MedicalTest
            .find()
            .exec(function( err, medicalTests ) {
                if( !medicalTests ) {
                    debug( 'end find() : Medical tests not found' );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Medical tests not found' );
                }
    
                if( err ) {
                    debug( 'end find() : %s', err.message );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                debug( 'end find() : medicalTests = %O', medicalTests );
                res.status( httpStatus.OK ).json( medicalTests );
            });
    },
    findById : function(req, res, next) {
        var medicalTestId = ( req.params && req.params.medicalTestId ) || 0;
        
        if( !medicalTestId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical test id missing in request' );
        }

        MedicalTest
            .findById( medicalTestId )
            .exec(function( err, medicalTest ) {
                if( !medicalTest ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Medical test with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                res.status( httpStatus.OK ).json( medicalTest );
            });
    },
    create: function(req, res, next) {
        var medicalTest = req.body;
        if( !medicalTest ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical test details not present in request body' );
        }

        MedicalTest
            .create( medicalTest, function( err, medicalTestNew ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                }

                return res.status(httpStatus.CREATED).json( medicalTestNew );
            });
    },
    updateById: function(req, res, next) {
        var medicalTestId = ( req.params && req.params.medicalTestId ) || 0;
        var medicalTestReq = req.body;
        
        if( !medicalTestId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical test id missing in request' );
        }

        if( !medicalTestReq ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical test details not present in request body' );
        }

        MedicalTest
            .findById( medicalTestId )
            .exec(function( err, medicalTest ) {
                if( !medicalTest ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Medical test with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                // @todo Test if this works fine in all situations
                _.assign( medicalTest, medicalTestReq );

                medicalTest.save(function( err, medicalTestNew ) {
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                    }

                    res.status( httpStatus.OK ).json( medicalTestNew );
                });
            });
    },
    deleteById: function(req, res, next) {
        var medicalTestId = ( req.params && req.params.medicalTestId ) || 0;

        if( !medicalTestId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical test id missing in request' );
        }

        MedicalTest
            .findByIdAndRemove(medicalTestId)
            .exec(function( err, medicalTest ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                if( !medicalTest ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Medical test with given id not found' );
                }

                res.status(httpStatus.NO_CONTENT).json(null);
            });
    }
};