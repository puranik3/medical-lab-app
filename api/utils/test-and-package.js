/**
 * Utility methods related to tests and packages
 */
var httpStatus = require( 'http-status' );
var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var Package = mongoose.model( 'Package' );
var MedicalTest = mongoose.model( 'MedicalTest' );
var debug = require( 'debug' )( 'medilab:api:utils:test-and-package' );
var wlogger = require('../../server/init-logger' );

// Accepts an array of test ids and returns tests data
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

// Accepts an array of test ids and package ids, and returns overall list of unique tests in the order passed as argument
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

module.exports = {
    getTests,
    getUniqueTests
};