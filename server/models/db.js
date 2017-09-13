var mongoose = require( 'mongoose' );
var readline = require( 'readline' );

var config = process.env.NODE_ENV === 'production' ? require( '../../env/config.prod.json' ) : require( '../../env/config.json' );

var dbUri;
if( process.env.NODE_ENV === 'production' ) {
    dbUri = `${config.data_sources[0].protocol}://${config.data_sources[0].username}:${config.data_sources[0].password}@${config.data_sources[0].server}:${config.data_sources[0].port}/${config.data_sources[0].db}`;
} else {
    dbUri = `${config.data_sources[0].protocol}://${config.data_sources[0].server}:${config.data_sources[0].port}/${config.data_sources[0].db}`;
}

mongoose.connect( dbUri, { useMongoClient: true } );

mongoose.connection.on('connected', function() {
    console.log( 'Mongoose connected to ' + dbUri );
});

mongoose.connection.on('error', function( err ) {
    console.log( 'Mongoose connection error ' + err );
});

mongoose.connection.on('disconnected', function() {
    console.log( 'Mongoose disconnected from ' + dbUri );
});

var gracefulShutdown = function( msg, callback ) {
    mongoose.connection.close(function() {
        console.log( 'Mongoose disconnected through ' + msg );
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