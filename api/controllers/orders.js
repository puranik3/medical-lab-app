var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var Order = mongoose.model( 'Order' );
var Package = mongoose.model( 'Package' );
var MedicalTest = mongoose.model( 'MedicalTest' );
var utils = require( '../../utils/utils' );
var debug = require( 'debug' )( 'medilab:api:controllers:orders' );
var wlogger = require('../../server/init-logger' );

function getTests( tests, callback ) {
    if( tests && tests.length ) {
        MedicalTest
            .find( { _id: { $in: tests } } )
            .exec(function( err, testsDetails ) {
                if( !testsDetails ) {
                    wlogger.info( '1. end getTests() : Tests not found - error retrieving information' );
                    debug( '1. end getTests() : Tests not found - error retrieving information' );
                    callback( new Error( 'Tests not found' ) );
                }

                if( err ) {
                    wlogger.info( '2. end getTests() : ', err.message );
                    debug( '2. end getTests() : %s', err.message );
                    callback( err );
                }

                // replace tests array with ObjectIds with tests array with tests data
                // package.tests.length = 0;
                // [].push.apply( package.tests, tests );

                wlogger.info( '3. end getTests() : testsDetails = ', JSON.stringify( testsDetails ) );
                debug( '3. end getTests() : testsDetails = %O', testsDetails );
                callback( null, testsDetails );
            });
    } else {
        wlogger.info( '4. end getTests() : tests = ', JSON.stringify( [] ) );
        debug( '4. end getTests() : tests = %O', [] );
        callback( null, [] );
    }
}

// gives overall list of unique tests in the order passed as argument
function getUniqueTests( { tests, packages }, callback ) {
    var uniqueTests = _.clone( tests );

    if( !packages || !packages.length ) {
        return getTests( uniqueTests, callback );
    }

    Package
        .find( { _id: { $in: packages } } )
        .exec(function( err, packages ) {
            if( !packages ) {
                wlogger.info( 'getUniqueTests() : Packages not found - error retrieving packages' );
                debug( 'getUniqueTests() : Packages not found - error retrieving packages' );
                callback( new Error( 'Packages not found - error retrieving packages' ) );
            }

            if( err ) {
                wlogger.info( 'getUniqueTests() : ', err.message );
                debug( 'getUniqueTests() : %s', err.message );
                callback( err );
            }

            // replace tests array with ObjectIds with tests array with tests data
            packages.forEach(function( package ) {
                // @todo Check for memory leaks and also code optimization here
                uniqueTests = _.concat( uniqueTests, package.tests );
            });
            uniqueTests = _.uniq( uniqueTests );

            console.log( 'uniqueTests = %O', uniqueTests );

            return getTests( uniqueTests, callback );
        });
}

function updateOrderAccessMetadata( order, isCreated ) {
    var now = new Date;
    if( isCreated ) {
        order.createdDate = now;
    }
    order.lastModifiedDate = now;
}

function updateReportAccessMetadata( order, isCreated ) {
    var now = new Date;
    if( isCreated ) {
        order.report.createdDate = now;
    }
    order.report.lastModifiedDate = now;
}

module.exports = {
    find: function(req, res, next) {
        debug( 'start find()' );
        Order
            .find()
            .exec(function( err, orders ) {
                if( !orders ) {
                    debug( 'end find() : Orders not found' );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Orders not found' );
                }
    
                if( err ) {
                    debug( 'end find() : %s', err.message );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                debug( 'end find() : orders = %O', orders );
                res.status( httpStatus.OK ).json( orders );
            });
    },
    findById : function(req, res, next) {
        var orderId = ( req.params && req.params.orderId ) || 0;
        
        if( !orderId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
        }

        Order
            .findById( orderId )
            .exec(function( err, order ) {
                if( !order ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                res.status( httpStatus.OK ).json( order );
            });
    },
    create: function(req, res, next) {
        var order = req.body;
        
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

        updateOrderAccessMetadata( order, true );
        
        // set order status and report status
        order._status = 'created';

        order.report = order.report || {};
        order.report._status = 'uninitiated';
        order.report.results = [];

        Order
            .create( order, function( err, orderNew ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                }

                return res.status(httpStatus.CREATED).json( orderNew );
            });
    },
    updateById: function(req, res, next) {
        var orderId = ( req.params && req.params.orderId ) || 0;
        var orderReq = req.body;
        
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

        Order
            .findById( orderId )
            .exec(function( err, order ) {
                if( !order ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                // @todo Test if this works fine in all situations
                _.assign( order, orderReq );

                updateOrderAccessMetadata( order );

                order.save(function( err, orderNew ) {
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                    }

                    res.status( httpStatus.OK ).json( orderNew );
                });
            });
    },
    deleteById: function(req, res, next) {
        var orderId = ( req.params && req.params.orderId ) || 0;

        if( !orderId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
        }

        Order
            .findByIdAndRemove(orderId)
            .exec(function( err, order ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                if( !order ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                }

                res.status(httpStatus.NO_CONTENT).json(null);
            });
    },
    medicalTestsAndPackages: {
        find: function(req, res, next) {
            var orderId = ( req.params && req.params.orderId ) || 0;

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }

            wlogger.info( 'start findMedicalTestsAndPackages()' );
            debug( 'start findMedicalTestsAndPackages()' );
            Order
                .findById( orderId )
                .exec(function( err, order ) {
                    if( !order ) {
                        wlogger.info( '1. end findMedicalTestsAndPackages() : Order with given id not found' );
                        debug( '1. end findMedicalTestsAndPackages() : Order with given id not found' );
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                    }
        
                    if( err ) {
                        wlogger.info( '2. end findMedicalTestsAndPackages() : ', err.message );
                        debug( '2. end findMedicalTestsAndPackages() : %s', err.message );
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    getUniqueTests( order, function( err, tests ) {
                        if( err ) {
                            wlogger.info( '3. end findMedicalTestsAndPackages() : ', err.message );
                            debug( '3. end findMedicalTestsAndPackages() : %s', err.message );
                            return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                        }

                        wlogger.info( '4. end findMedicalTestsAndPackages() : tests = ', JSON.stringify( tests ) );
                        debug( '4. end findMedicalTestsAndPackages() : tests = %O', tests );
                        res.status( httpStatus.OK ).json( tests );
                    });
                });
        },
        // adds medical tests and packages whose ids are passed in the request body - existing tests and packages will NOT be removed by this method
        add: function(req, res, next) {
            var orderId = ( req.params && req.params.orderId ) || 0;
            var medicalTestAndPackageIdsReq = req.body;

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }

            if( !medicalTestAndPackageIdsReq ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'List of test and/or package id(s) to be added not present in request body' );
            }

            Order
                .findById( orderId )
                .exec(function( err, order ) {
                    if( !order ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                    }

                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    if( order.report._status !== 'uninitiated' ) {
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

                    updateOrderAccessMetadata( order );
                    
                    order.save(function( err, orderNew ) {
                        if( err ) {
                            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                        }

                        res.status( httpStatus.OK ).json( orderNew );
                    });
                });
        },
        delete: function(req, res, next) {
            var orderId = ( req.params && req.params.orderId ) || 0;
            var id = ( req.params && req.params.id ) || 0;

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }

            if( !id ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical Test or package id missing in request' );
            }

            if( !req.query || !req.query.type || ( req.query.type !== 'medicaltest' && req.query.type !== 'package' ) ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'The type parameter should be present as parameter and should have one of two values - medicaltest or package' );
            }

            Order
                .findById( orderId )
                .exec(function( err, order ) {
                    if( !order ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                    }

                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
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

                    order.save(function( err, orderNew ) {
                        if( err ) {
                            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                        }

                        res.status( httpStatus.OK ).json( orderNew );
                    });
                });
        }
    },
    reports: {
        find: function(req, res, next) {
            var orderId = ( req.params && req.params.orderId ) || 0;
            
            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }
    
            Order
                .findById( orderId )
                .exec(function( err, order ) {
                    if( !order ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                    }
    
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }
    
                    res.status( httpStatus.OK ).json( order.report );
                });
        },
        update: function(req, res, next) {
            var orderId = ( req.params && req.params.orderId ) || 0;
            var reportReq = req.body;
            var action = req.query && req.query.action;

            wlogger.info( 'report.update() started' );
            debug( 'report.update() started' );

            if( !orderId ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Order id missing in request' );
            }
    
            if( !reportReq ) {
                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Report details not present in request body' );
            }

            Order
                .findById( orderId )
                .exec(function( err, order ) {
                    wlogger.info( 'report.update() fetched order' );
                    debug( 'report.update() fetched order' );
        
                    if( !order ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Order with given id not found' );
                    }
    
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                    }

                    if( order.report && order.report._status === 'completed' ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'The report associated with this order has been marked completed and hence cannot be updated' );
                    }

                    if( order.report && order.report._status === 'uninitiated' && action !== 'initiate' ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.UNPROCESSABLE_ENTITY, 'The report associated with this order has to be initiated before it can be updated further. Initiate the report and try again.' );
                    }

                    function saveChangesAndSendReport( order, isCreated ) {
                        updateReportAccessMetadata( order, isCreated );
                        order.save(function( err, orderNew ) {
                            if( err ) {
                                return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                            }
    
                            res.status( httpStatus.OK ).json( orderNew.report );
                        });
                    }

                    if( order.report && order.report._status === 'uninitiated' && action === 'initiate' ) {
                        getUniqueTests( order, function( err, tests ) {
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

                            return saveChangesAndSendReport( order, true );
                        });    
                    } else if( order.report && order.report._status === 'initiated' && ( !action || action === 'draft' ) ) {
                        // @todo Test if this works fine in all situations
                        _.assign( order.report.results, reportReq );

                        console.log( '*** order.report.results ***' );
                        console.log( JSON.stringify( order.report.results, null, 4 ) );
                        
                        console.log( '*** reportReq ***' );
                        console.log( JSON.stringify( reportReq, null, 4 ) );
                        
                        return saveChangesAndSendReport( order );
                    } else if( order.report && order.report._status === 'initiated' && action === 'complete' ) {
                        order.report._status = 'completed';
                        return saveChangesAndSendReport( order );
                    } else {
                        res.status( httpStatus.UNPROCESSABLE_ENTITY ).json({
                            message: 'Invalid action for report in current state. Please check the action you are initiating.'
                        });
                    }
                });
        }
    }
};