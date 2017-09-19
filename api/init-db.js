var mongoose = require( 'mongoose' );
var readline = require( 'readline' );
var debug = require( 'debug' )( 'medilab:api:initdb' );

mongoose.connect( global.MediLab.DB_URI, { useMongoClient: true } );

mongoose.connection.on('connected', function() {
    debug( 'Mongoose connected to %s', global.MediLab.DB_URI );
});

mongoose.connection.on('error', function( err ) {
    debug( 'Mongoose connection error : %o', err );
});

mongoose.connection.on('disconnected', function() {
    debug( 'Mongoose disconnected from %s', global.MediLab.DB_URI );
});

var gracefulShutdown = function( msg, callback ) {
    mongoose.connection.close(function() {
        debug( 'Mongoose disconnected through %s', msg );
        callback();
    });
};

// to trigger SIGINT on old versions of Windows
if( process.platform === 'win32' ) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on( 'SIGINT', function() {
        process.emit( 'SIGINT' );
    });
}

// for nodemon restarts
process.once( 'SIGUSR2', function() {
    gracefulShutdown( 'nodemon restart', function() {
        process.kill( process.pid, 'SIGUSR2' );
    });
});

// for local app termination
process.on( 'SIGINT', function() {
    gracefulShutdown( 'app termination', function() {
        process.exit( 0 );
    });
});

// for Heroku app termination
process.once( 'SIGTERM', function() {
    gracefulShutdown( 'Heroku app shitdown', function() {
        process.exit( 0 );
    });
});

// Make sure models are available
require( './init-models' );