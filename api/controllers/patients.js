var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var Patient = mongoose.model( 'Patient' );
var utils = require( '../../utils/utils' );
var debug = require( 'debug' )( 'medilab:api:controllers:patients' );

module.exports = {
    find: function(req, res, next) {
        debug( 'start find()' );
        Patient
            .find()
            .exec(function( err, patients ) {
                if( !patients ) {
                    debug( 'end find() : Patients not found' );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patients not found' );
                }
    
                if( err ) {
                    debug( 'end find() : %s', err.message );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                debug( 'end find() : patients = %O', patients );
                res.status( httpStatus.OK ).json( patients );
            });
    },
    findById : function(req, res, next) {
        var patientId = ( req.params && req.params.patientId ) || 0;
        
        if( !patientId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
        }

        Patient
            .findById( patientId )
            .exec(function( err, patient ) {
                if( !patient ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                res.status( httpStatus.OK ).json( patient );
            });
    },
    create: function(req, res, next) {
        var patient = req.body;
        if( !patient ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient details not present in request body' );
        }

        Patient
            .create( patient, function( err, patientNew ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                }

                return res.status(httpStatus.CREATED).json( patientNew );
            });
    },
    updateById: function(req, res, next) {
        var patientId = ( req.params && req.params.patientId ) || 0;
        var patientReq = req.body;
        
        if( !patientId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
        }

        if( !patientReq ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient details not present in request body' );
        }

        Patient
            .findById( patientId )
            .exec(function( err, patient ) {
                if( !patient ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                // @todo Test if this works fine in all situations
                _.assign( patient, patientReq );

                patient.save(function( err, patientNew ) {
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                    }

                    res.status( httpStatus.OK ).json( patientNew );
                });
            });
    },
    deleteById: function(req, res, next) {
        var patientId = ( req.params && req.params.patientId ) || 0;

        if( !patientId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
        }

        Patient
            .findByIdAndRemove(patientId)
            .exec(function( err, patient ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                if( !patient ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                }

                res.status(httpStatus.NO_CONTENT).json(null);
            });
    }
};