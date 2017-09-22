var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var Package = mongoose.model( 'Package' );
var utils = require( '../../utils/utils' );
var debug = require( 'debug' )( 'medilab:api:controllers:packages' );
var wlogger = require('../../server/init-logger' );

module.exports = {
    find: function(req, res, next) {
        wlogger.info( 'start find()' );
        debug( 'start find()' );
        Package
            .find()
            .exec(function( err, packages ) {
                if( !packages ) {
                    wlogger.info( 'end find() : Packages not found' );
                    debug( 'end find() : Packages not found' );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Packages not found' );
                }
    
                if( err ) {
                    wlogger.info( 'end find() : ', err.message );
                    debug( 'end find() : %s', err.message );
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                if( packages.tests ) {
                    MedicalTests
                        .find( { _id: { $in: packages.tests } } )
                        .exec(function( err, tests ) {
                            if( !tests ) {
                                wlogger.info( 'end find() : Tests in the package not found - error retrieving package information' );
                                debug( 'end find() : Tests in the package not found - error retrieving package information' );
                                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Tests in the package not found' );
                            }
                
                            if( err ) {
                                wlogger.info( 'end find() : ', err.message );
                                debug( 'end find() : %s', err.message );
                                return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                            }

                            // replace tests array with ObjectIds with tests array with tests data
                            packages.tests = tests;

                            wlogger.info( 'end find() : packages = ', JSON.stringify( packages ) );
                            debug( 'end find() : packages = %O', packages );
                            res.status( httpStatus.OK ).json( packages );
                        });
                } else {
                    wlogger.info( 'end find() : packages = ', JSON.stringify( packages ) );
                    debug( 'end find() : packages = %O', packages );
                    res.status( httpStatus.OK ).json( packages );
                } 
            });
    },
    findById : function(req, res, next) {
        var packageId = ( req.params && req.params.packageId ) || 0;
        
        if( !packageId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package id missing in request' );
        }

        Package
            .findById( packageId )
            .exec(function( err, package ) {
                if( !package ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Package with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                res.status( httpStatus.OK ).json( package );
            });
    },
    create: function(req, res, next) {
        var package = req.body;
        if( !package ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package details not present in request body' );
        }

        Package
            .create( package, function( err, packageNew ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                }

                return res.status(httpStatus.CREATED).json( packageNew );
            });
    },
    updateById: function(req, res, next) {
        var packageId = ( req.params && req.params.packageId ) || 0;
        var packageReq = req.body;
        
        if( !packageId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package id missing in request' );
        }

        if( !packageReq ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package details not present in request body' );
        }

        Package
            .findById( packageId )
            .exec(function( err, package ) {
                if( !package ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Package with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                // @todo Test if this works fine in all situations
                _.assign( package, packageReq );

                package.save(function( err, packageNew ) {
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                    }

                    res.status( httpStatus.OK ).json( packageNew );
                });
            });
    },
    deleteById: function(req, res, next) {
        var packageId = ( req.params && req.params.packageId ) || 0;

        if( !packageId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package id missing in request' );
        }

        Package
            .findByIdAndRemove(packageId)
            .exec(function( err, package ) {
                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                if( !package ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Package with given id not found' );
                }

                res.status(httpStatus.NO_CONTENT).json(null);
            });
    },
    // adds medical tests whose ids are passed in the request body - existing tests will NOT be removed by this method
    addMedicalTests: function(req, res, next) {
        var packageId = ( req.params && req.params.packageId ) || 0;
        var medicalTestIdsReq = req.body;

        if( !packageId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package id missing in request' );
        }

        if( !medicalTestIdsReq ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'List of tests to be added not present in request body' );
        }

        Package
            .findById( packageId )
            .exec(function( err, package ) {
                if( !package ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Package with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                package.tests = _.union( package.tests, medicalTestIdsReq.map(function( id ) { 
                    return mongoose.Schema.ObjectId( id );
                }));

                package.save(function( err, packageNew ) {
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                    }

                    res.status( httpStatus.OK ).json( packageNew );
                });
            });
    },
    deleteMedicalTestById: function(req, res, next) {
        var packageId = ( req.params && req.params.packageId ) || 0;
        var medicalTestId = ( req.params && req.params.medicalTestId ) || 0;

        if( !packageId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Package id missing in request' );
        }

        if( !medicalTestId ) {
            return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, 'Medical Test id missing in request' );
        }

        Package
            .findById( packageId )
            .exec(function( err, package ) {
                if( !package ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, 'Package with given id not found' );
                }

                if( err ) {
                    return utils.sendJsonErrorResponse( req, res, httpStatus.NOT_FOUND, err.message );
                }

                _.pullAll( package.tests, [ medicalTestId ] );

                package.save(function( err, packageNew ) {
                    if( err ) {
                        return utils.sendJsonErrorResponse( req, res, httpStatus.BAD_REQUEST, err.message );
                    }

                    res.status( httpStatus.OK ).json( packageNew );
                });
            });
    }
};