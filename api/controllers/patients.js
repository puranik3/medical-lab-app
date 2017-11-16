var path = require( 'path' );
var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var Patient = mongoose.model( 'Patient' );
var Order = mongoose.model( 'Order' );
var utils = require( '../../utils/utils' );
var debug = require( 'debug' )( 'medilab:api:controllers:patients' );
var wlogger = require('../../server/init-logger' );
var testPackageUtils = require( '../utils/test-and-package' );

var perPage = 10;

var helpers = {
    updateOrderAccessMetadata: function( order, isCreated ) {
        var now = new Date;
        if( isCreated ) {
            order.createdDate = now;
        }
        order.lastModifiedDate = now;
    },
    updateReportAccessMetadata: function( order, isCreated ) {
        var now = new Date;
        if( isCreated ) {
            order.report.createdDate = now;
        }
        order.report.lastModifiedDate = now;
    }
};

module.exports = {
    count: function(req, res, next) {
        debug( 'start count()' );

        Patient.count(function( err, count ) {
            res.status( httpStatus.OK ).json( {
                documents: count,
                pages: Math.ceil( count / perPage )
            });
        });
    },
    find: function(req, res, next) {
        wlogger.info( 'start find()' );
        debug( 'start find()' );

        var page = req.param('page')

        var query = Patient
            .find()
            .sort( 'name' )
            .select( 'name dob age sex emails phones' );

        if( page ) {
            query
                .limit( perPage )
                .skip( perPage * page )
        }

        query.exec(function( err, patients ) {
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

            wlogger.info( 'end find() : patients = ', JSON.stringify( patients ) );
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
            .select( 'name dob age sex emails phones' )
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

        if( patient.orders ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order cannot be added at the time of patient creation. Remove order information from request body and try again.' );
        }
        
        // add empty orders array
        patient.orders = [];

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

        if( patientReq.orders ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Orders information cannot be modified at the time of patient updation. Remove order information from request body and try again.' );
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
    },
    orders: {
        find: function(req, res, next) {
            wlogger.info( 'start orders.find()' );
            debug( 'start orders.find()' );

            var patientId = ( req.params && req.params.patientId ) || 0;
            
            if( !patientId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
            }
    
            Patient
                .findById( patientId )
                .select( 'orders' )
                .exec(function( err, patient ) {
                    if( !patient ) {
                        wlogger.info( '1. end orders.find() : Patient with given id not found' );
                        debug( '1. end orders.find() : Patient with given id not found' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                    }
    
                    if( err ) {
                        wlogger.info( '2. end orders.find() : ', err.message );
                        debug( '2. end orders.find() : ', err.message );
                        
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    if( !patient.orders ) {
                        wlogger.info( '3. end orders.find() : Orders not found for patient with given id' );
                        debug( '3. end orders.find() : Orders not found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                    }
    
                    res.status( httpStatus.OK ).json( patient.orders );
                });
        },
        findById: function(req, res, next) {
            wlogger.info( 'start orders.findById()' );
            debug( 'start orders.findById()' );

            var patientId = ( req.params && req.params.patientId ) || 0;
            var orderId = ( req.params && req.params.orderId ) || 0;
            
            if( !patientId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
            }

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }
    
            Patient
                .findById( patientId )
                .select( 'orders' )
                .exec(function( err, patient ) {
                    if( !patient ) {
                        wlogger.info( '1. end orders.findById() : Patient with given id not found' );
                        debug( '1. end orders.findById() : Patient with given id not found' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                    }
    
                    if( err ) {
                        wlogger.info( '2. end orders.findById() : ', err.message );
                        debug( '2. end orders.findById() : ', err.message );
                        
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    if( !patient.orders || !patient.orders.length ) {
                        wlogger.info( '3. end orders.findById() : Orders not found for patient with given id' );
                        debug( '3. end orders.findById() : Orders not found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                    }

                    var order = patient.orders.id(orderId);

                    if( !order ) {
                        wlogger.info( '4. end orders.findById() : Order with given id not found for patient with given id' );
                        debug( '4. end orders.findById() : Order with given id not found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                    }
    
                    res.status( httpStatus.OK ).json( order );
                });
        },
        create: function(req, res, next) {
            wlogger.info( 'start orders.create()' );
            debug( 'start orders.create()' );

            var that = this;

            var patientId = ( req.params && req.params.patientId ) || 0;
            var order = req.body;
            
            if( !patientId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
            }

            if( !order ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order details not present in request body' );
            }
    
            if( order.tests ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Test addition not currently supported when creating order. Remove test(s) and try again.' );
            }
    
            if( order.packages ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Package addition not currently supported when creating order. Remove package(s) and try again.' );
            }
    
            if( order.report ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Report cannot be part of new order. Remove report and try again.' );
            }

            Patient
                .findById( patientId )
                .select( 'orders' )
                .exec(function( err, patient ) {
                    if( !patient ) {
                        wlogger.info( '1. end orders.create() : Patient with given id not found' );
                        debug( '1. end orders.create() : Patient with given id not found' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                    }

                    if( err ) {
                        wlogger.info( '2. end orders.create() : ', err.message );
                        debug( '2. end orders.create() : ', err.message );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    helpers.updateOrderAccessMetadata( order, true );
                    
                    // set order status and report status
                    order._status = 'created';
            
                    order.report = order.report || {};
                    order.report._status = 'uninitiated';
                    order.report.results = [];
            
                    patient.orders = patient.orders || [];
                    patient.orders.push( order );
        
                    patient
                        .save( function( err, patientNew ) {
                            if( err ) {
                                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                            }
            
                            return res.status(httpStatus.CREATED).json( patientNew.orders[patientNew.orders.length - 1] );
                        });
                });
        },
        updateById: function(req, res, next) {
            wlogger.info( 'start orders.updateById()' );
            debug( 'start orders.updateById()' );

            var that = this;

            var patientId = ( req.params && req.params.patientId ) || 0;
            var orderId = ( req.params && req.params.orderId ) || 0;
            var orderReq = req.body;
            
            if( !patientId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
            }

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }

            if( !orderReq ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order details not present in request body' );
            }
    
            if( orderReq.tests ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Test updation not currently supported when updating order. Remove test(s) and try again.' );
            }
    
            if( orderReq.packages ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Package updation not currently supported when updating order. Remove package(s) and try again.' );
            }
    
            if( orderReq.report ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Report updation not currently supported when updating order. Remove report and try again.' );
            }
        
            Patient
                .findById( patientId )
                .select( 'orders' )
                .exec(function( err, patient ) {
                    if( !patient ) {
                        wlogger.info( '1. end orders.updateById() : Patient with given id not found' );
                        debug( '1. end orders.updateById() : Patient with given id not found' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                    }

                    if( err ) {
                        wlogger.info( '2. end orders.updateById() : ', err.message );
                        debug( '2. end orders.updateById() : ', err.message );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    if( !patient.orders ) {
                        wlogger.info( '3. end orders.updateById() : No orders found for patient with given id' );
                        debug( '3. end orders.updateById() : No orders found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'No orders found for patient with given id' );
                    }

                    var order = patient.orders.id(orderId);

                    if( !order ) {
                        wlogger.info( '4. end orders.updateById() : Order with given id not found for patient with given id' );
                        debug( '4. end orders.updateById() : Order with given id not found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                    }

                    // @todo Test if this works fine in all situations
                    _.assign( order, orderReq );

                    helpers.updateOrderAccessMetadata( order );

                    patient
                        .save( function( err, patientNew ) {
                            if( err ) {
                                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                            }
            
                            return res.status(httpStatus.OK).json( patientNew.orders[patientNew.orders.length - 1] );
                        });
                });
        },
        deleteById: function(req, res, next) {
            wlogger.info( 'start orders.deleteById()' );
            debug( 'start orders.deleteById()' );

            var patientId = ( req.params && req.params.patientId ) || 0;
            var orderId = ( req.params && req.params.orderId ) || 0;
            
            if( !patientId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
            }

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }

            Patient
                .findById( patientId )
                .select( 'orders' )
                .exec(function( err, patient ) {
                    if( !patient ) {
                        wlogger.info( '1. end orders.deleteById() : Patient with given id not found' );
                        debug( '1. end orders.deleteById() : Patient with given id not found' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                    }
    
                    if( err ) {
                        wlogger.info( '2. end orders.deleteById() : ', err.message );
                        debug( '2. end orders.deleteById() : ', err.message );
                        
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    if( !patient.orders ) {
                        wlogger.info( '3. end orders.deleteById() : Orders not found for patient with given id' );
                        debug( '3. end orders.deleteById() : Orders not found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                    }
                    
                    if( !patient.orders.id(orderId) ) {
                        wlogger.info( '4. end orders.findById() : Order with given id not found for patient with given id' );
                        debug( '4. end orders.findById() : Order with given id not found for patient with given id' );

                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                    }
                    
                    patient.orders.id(orderId).remove();

                    patient
                        .save( function( err, patientNew ) {
                            if( err ) {
                                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                            }
            
                            return res.status(httpStatus.NO_CONTENT).json( null );
                        });
                });
        },
        medicalTestsAndPackages: {
            find: function(req, res, next) {
                wlogger.info( 'start order.medicalTestsAndPackages.find()' );
                debug( 'start order.medicalTestsAndPackages.find()' );

                var patientId = ( req.params && req.params.patientId ) || 0;
                var orderId = ( req.params && req.params.orderId ) || 0;
    
                if( !patientId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
                }

                if( !orderId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
                }

                Patient
                    .findById( patientId )
                    .select( 'orders' )
                    .exec(function( err, patient ) {
                        if( !patient ) {
                            wlogger.info( '2. end order.medicalTestsAndPackages.find() : Patient with given id not found' );
                            debug( '2. end order.medicalTestsAndPackages.find() : Patient with given id not found' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                        }
        
                        if( err ) {
                            wlogger.info( '3. end order.medicalTestsAndPackages.find() : ', err.message );
                            debug( '3. end order.medicalTestsAndPackages.find() : ', err.message );
                            
                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                        }

                        if( !patient.orders || !patient.orders.length ) {
                            wlogger.info( '4. end order.medicalTestsAndPackages.find() : Orders not found for patient with given id' );
                            debug( '4. end order.medicalTestsAndPackages.find() : Orders not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                        }

                        var order = patient.orders.id(orderId);

                        if( !order ) {
                            wlogger.info( '5. end order.medicalTestsAndPackages.find() : Order with given id not found for patient with given id' );
                            debug( '5. end order.medicalTestsAndPackages.find() : Order with given id not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                        }
        
                        testPackageUtils.getUniqueTests( order, function( err, tests ) {
                            if( err ) {
                                wlogger.info( '6. end order.medicalTestsAndPackages.find() : ', err.message );
                                debug( '6. end order.medicalTestsAndPackages.find() : %s', err.message );
                                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                            }
    
                            wlogger.info( '7. end order.medicalTestsAndPackages.find() : tests = ', JSON.stringify( tests ) );
                            debug( '7. end order.medicalTestsAndPackages.find() : tests = %O', tests );
                            res.status( httpStatus.OK ).json( tests );
                        });
                    });
            },
            // adds medical tests and packages whose ids are passed in the request body - existing tests and packages will NOT be removed by this method
            add: function(req, res, next) {
                wlogger.info( 'start order.medicalTestsAndPackages.add()' );
                debug( 'start order.medicalTestsAndPackages.add()' );

                var patientId = ( req.params && req.params.patientId ) || 0;
                var orderId = ( req.params && req.params.orderId ) || 0;

                var medicalTestAndPackageIdsReq = req.body;
                
                if( !patientId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
                }

                if( !orderId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
                }
    
                if( !medicalTestAndPackageIdsReq ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'List of test and/or package id(s) to be added not present in request body' );
                }

                Patient
                    .findById( patientId )
                    .select( 'orders' )
                    .exec(function( err, patient ) {
                        if( !patient ) {
                            wlogger.info( '1. end order.medicalTestsAndPackages.add() : Patient with given id not found' );
                            debug( '1. end order.medicalTestsAndPackages.add() : Patient with given id not found' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                        }
        
                        if( err ) {
                            wlogger.info( '2. end order.medicalTestsAndPackages.add() : ', err.message );
                            debug( '2. end order.medicalTestsAndPackages.add() : ', err.message );
                            
                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                        }

                        if( !patient.orders || !patient.orders.length ) {
                            wlogger.info( '3. end order.medicalTestsAndPackages.add() : Orders not found for patient with given id' );
                            debug( '3. end order.medicalTestsAndPackages.add() : Orders not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                        }

                        var order = patient.orders.id(orderId);

                        if( !order ) {
                            wlogger.info( '4. end order.medicalTestsAndPackages.add() : Order with given id not found for patient with given id' );
                            debug( '4. end order.medicalTestsAndPackages.add() : Order with given id not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                        }
        
                        if( order.report && order.report._status !== 'uninitiated' ) {
                            return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Tests and packages cannot be added to the order as the report has been initiated.' );
                        }

                        console.log( 'medicalTestAndPackageIdsReq.tests[0] = %s', medicalTestAndPackageIdsReq.tests && medicalTestAndPackageIdsReq.tests[0] );
                        console.log( 'medicalTestAndPackageIdsReq.packages[0] = %s', medicalTestAndPackageIdsReq.packages && medicalTestAndPackageIdsReq.packages[0] );

                        // https://stackoverflow.com/questions/15102532/mongo-find-through-list-of-ids
                        if( medicalTestAndPackageIdsReq.tests ) {
                            order.tests = _.unionBy(
                                order.tests,
                                medicalTestAndPackageIdsReq.tests.map(function( id ) { 
                                    return mongoose.Types.ObjectId( id );
                                }),
                                function( objectId ) {
                                    return objectId.toString()
                                }
                            );
                        }
    
                        if( medicalTestAndPackageIdsReq.packages ) {
                            order.packages = _.unionBy(
                                order.packages,
                                medicalTestAndPackageIdsReq.packages.map(function( id ) { 
                                    return mongoose.Types.ObjectId( id );
                                }),
                                function( objectId ) {
                                    return objectId.toString()
                                }
                            );
                        }

                        debug( 'order.tests = %o', order.tests );
                        debug( 'order.packages = %o', order.packages );
    
                        helpers.updateOrderAccessMetadata( order );

                        patient
                            .save( function( err, patientNew ) {
                                if( err ) {
                                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                                }

                                return res.status(httpStatus.OK).json( patientNew.orders.id(orderId) );
                            });
                    });
            },
            delete: function(req, res, next) {
                wlogger.info( 'start order.medicalTestsAndPackages.delete()' );
                debug( 'start order.medicalTestsAndPackages.delete()' );

                var patientId = ( req.params && req.params.patientId ) || 0;
                var orderId = ( req.params && req.params.orderId ) || 0;
                var id = ( req.params && req.params.id ) || 0;            
    
                if( !patientId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
                }

                if( !orderId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
                }

                if( !id ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical Test or package id missing in request' );
                }
    
                if( !req.query || !req.query.type || ( req.query.type !== 'medicaltest' && req.query.type !== 'package' ) ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'The type parameter should be present as parameter and should have one of two values - medicaltest or package' );
                }

                Patient
                    .findById( patientId )
                    .select( 'orders' )
                    .exec(function( err, patient ) {
                        if( !patient ) {
                            wlogger.info( '2. end order.medicalTestsAndPackages.delete() : Patient with given id not found' );
                            debug( '2. end order.medicalTestsAndPackages.delete() : Patient with given id not found' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                        }
        
                        if( err ) {
                            wlogger.info( '3. end order.medicalTestsAndPackages.delete() : ', err.message );
                            debug( '3. end order.medicalTestsAndPackages.delete() : ', err.message );
                            
                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                        }

                        if( !patient.orders || !patient.orders.length ) {
                            wlogger.info( '4. end order.medicalTestsAndPackages.delete() : Orders not found for patient with given id' );
                            debug( '4. end order.medicalTestsAndPackages.delete() : Orders not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                        }

                        var order = patient.orders.id(orderId);

                        if( !order ) {
                            wlogger.info( '5. end order.medicalTestsAndPackages.delete() : Order with given id not found for patient with given id' );
                            debug( '5. end order.medicalTestsAndPackages.delete() : Order with given id not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                        }

                        if( order.report._status !== 'uninitiated' ) {
                            return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'Tests and packages cannot be removed from the order as the report has been initiated.' );
                        }

                        /*_.remove(package.tests, function( objectId ) {
                            return objectId.toString() === medicalTestId;
                        });*/
                        if( req.query.type === 'medicaltest' ) {
                            var index = _.findIndex(order.tests, function( objectId ) {
                                return objectId.toString() === id;
                            });
                            if( index !== -1 ) {
                                order.tests.splice(index, 1);
                            } else {
                                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Could not find medical test in order' );
                            }
                            debug( 'order after splice = %o', order );
                        } else {
                            var index = _.findIndex(order.packages, function( objectId ) {
                                return objectId.toString() === id;
                            });
                            if( index !== -1 ) {
                                order.packages.splice(index, 1);
                            } else {
                                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Could not find package in order' );
                            }
                            debug( 'order after splice = %o', order );
                        }
    
                        helpers.updateOrderAccessMetadata( order );

                        patient
                            .save( function( err, patientNew ) {
                                if( err ) {
                                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                                }

                                return res.status(httpStatus.OK).json( patientNew.orders.id(orderId) );
                            });
                });
            }
        },
        report: {
            find: function(req, res, next) {
                wlogger.info( 'start order.report.find()' );
                debug( 'start order.report.find()' );

                var patientId = ( req.params && req.params.patientId ) || 0;
                var orderId = ( req.params && req.params.orderId ) || 0;
    
                if( !patientId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
                }

                if( !orderId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
                }

                Patient
                    .findById( patientId )
                    .select( 'orders' )
                    .exec(function( err, patient ) {
                        if( !patient ) {
                            wlogger.info( '2. end order.report.find() : Patient with given id not found' );
                            debug( '2. end order.report.find() : Patient with given id not found' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                        }
        
                        if( err ) {
                            wlogger.info( '3. end order.report.find() : ', err.message );
                            debug( '3. end order.report.find() : ', err.message );
                            
                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                        }

                        if( !patient.orders || !patient.orders.length ) {
                            wlogger.info( '4. end order.report.find() : Orders not found for patient with given id' );
                            debug( '4. end order.report.find() : Orders not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                        }

                        var order = patient.orders.id(orderId);

                        if( !order ) {
                            wlogger.info( '5. end order.report.find() : Order with given id not found for patient with given id' );
                            debug( '5. end order.report.find() : Order with given id not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                        }
        
                        res.status( httpStatus.OK ).json( order.report );
                    });
            },
            update: function(req, res, next) {
                wlogger.info( 'start order.report.update()' );
                debug( 'start order.report.update()' );

                var patientId = ( req.params && req.params.patientId ) || 0;
                var orderId = ( req.params && req.params.orderId ) || 0;
                var reportReq = req.body;
                var action = req.query && req.query.action;
    
                if( !patientId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Patient id missing in request' );
                }
                
                if( !orderId ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
                }
        
                if( !reportReq ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Report details not present in request body' );
                }
    
                Patient
                    .findById( patientId )
                    .exec(function( err, patient ) {
                        if( !patient ) {
                            wlogger.info( '2. end order.report.find() : Patient with given id not found' );
                            debug( '2. end order.report.find() : Patient with given id not found' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Patient with given id not found' );
                        }
        
                        if( err ) {
                            wlogger.info( '3. end order.report.find() : ', err.message );
                            debug( '3. end order.report.find() : ', err.message );
                            
                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                        }

                        if( !patient.orders || !patient.orders.length ) {
                            wlogger.info( '4. end order.report.find() : Orders not found for patient with given id' );
                            debug( '4. end order.report.find() : Orders not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found for patient with given id' );
                        }

                        var order = patient.orders.id(orderId);

                        if( !order ) {
                            wlogger.info( '5. end order.report.find() : Order with given id not found for patient with given id' );
                            debug( '5. end order.report.find() : Order with given id not found for patient with given id' );

                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found for patient with given id' );
                        }
        
                        if( order.report && order.report._status === 'completed' ) {
                            return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'The report associated with this order has been marked completed and hence cannot be updated' );
                        }

                        if( order.report && order.report._status === 'uninitiated' && action !== 'initiate' ) {
                            return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'The report associated with this order has to be initiated before it can be updated further. Initiate the report and try again.' );
                        }

                        function saveChangesAndSendReport( patient, order, orderId, isCreated ) {
                            helpers.updateReportAccessMetadata( order, isCreated );
                            patient.save(function( err, patientNew ) {
                                console.log( 'patient = ', JSON.stringify( patientNew, null, 4 ) );

                                if( err ) {
                                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                                }
        
                                res.status( httpStatus.OK ).json( patientNew.orders.id(orderId).report );
                            });
                        }

                        if( order.report && order.report._status === 'uninitiated' && action === 'initiate' ) {
                            testPackageUtils.getUniqueTests( order, function( err, tests ) {
                                wlogger.info( 'report.update() fetched unique tests' );
                                debug( 'report.update() fetched unique tests' );
            
                                order.report._status = 'initiated';
                                
                                var results = tests.map(function( test ) {
                                    // @todo Check if these deletions can be avoided
                                    //delete test._id;
                                    delete test.__v;
    
                                    return {
                                        test: test,
                                        result: ''
                                    };
                                });
    
                                order.report.results = _.unionBy(
                                    order.report.results,
                                    results,
                                    function( result ) {
                                        return result.test._id
                                    }
                                );
    
                                return saveChangesAndSendReport( patient, order, orderId, true );
                            });    
                        } else if( order.report && order.report._status === 'initiated' && ( !action || action === 'draft' ) ) {
                            // @todo Test if this works fine in all situations
                            _.assign( order.report.results, reportReq );
    
                            console.log( '*** order.report.results ***' );
                            console.log( JSON.stringify( order.report.results, null, 4 ) );
                            
                            console.log( '*** reportReq ***' );
                            console.log( JSON.stringify( reportReq, null, 4 ) );
                            
                            return saveChangesAndSendReport( patient, order, orderId );
                        } else if( order.report && order.report._status === 'initiated' && action === 'complete' ) {
                            console.log( 'patient = ', JSON.stringify( patient, null, 4 ) );
                            order.report._status = 'completed';
                            utils.generateReport(
                                patient,
                                order,
                                path.join( __dirname, '../../', 'documents/reports/' + order._id + '.pdf' ),
                                'application/pdf'
                            );
                            return saveChangesAndSendReport( patient, order, orderId );
                        } else {
                            res.status( httpStatus.UNPROCESSABLE_ENTITY ).json({
                                message: 'Invalid action for report in current state. Please check the action you are initiating.'
                            });
                        }
                    });
            }
        }
    }
};