var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var Patient = mongoose.model( 'Patient' );
var utils = require( '../../utils/utils' );
var debug = require( 'debug' )( 'medilab:api:controllers:orders' );
var wlogger = require('../../server/init-logger' );

module.exports = {
    find: function(req, res, next) {
        wlogger.info( 'start find()' );
        debug( 'start find()' );
        Patient
            .find()
            .select( 'name emails phones orders' )
            .exec(function( err, patients ) {
                if( !patients ) {
                    wlogger.info( 'end find() : Patients not found' );
                    debug( 'end find() : Patients not found' );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patients not found' );
                }
    
                if( err ) {
                    wlogger.info( 'end find() : ', err.message );
                    debug( 'end find() : %s', err.message );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                // transform data to yield one order per object
                var orders = [];
                patients.forEach(function( patient ) {
                    patient.orders.forEach(function( order ) {
                        orders.push({
                            patient: {
                                _id: patient._id,
                                name: patient.name,
                                email: patient.emails,
                                phones: patient.phones
                            },
                            order: order
                        });
                    });
                });

                wlogger.info( 'end find() : patients = ', JSON.stringify( patients ) );
                debug( 'end find() : patients = %O', patients );
                res.status( httpStatus.OK ).json( orders );
            });
    }
};