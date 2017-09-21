var deepFreeze = require( 'deep-freeze-strict' );
var config = process.env.NODE_ENV === 'production' ? require( './config.prod.json' ) : require( './config.json' );

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

var appPort, apiBaseUrl, dbUri;

appPort = normalizePort( process.env.PORT || config.app && config.app.port || 3000 );

if( process.env.NODE_ENV === 'production' ) {
    apiBaseUrl = `${config.apiBaseUrl}/api`;
    dbUri = `${config.data_sources[0].protocol}://${config.data_sources[0].username}:${config.data_sources[0].password}@${config.data_sources[0].server}:${config.data_sources[0].port}/${config.data_sources[0].db}`;
} else {
    apiBaseUrl = `${config.apiBaseUrl}:${appPort}/api`;
    dbUri = `${config.data_sources[0].protocol}://${config.data_sources[0].server}:${config.data_sources[0].port}/${config.data_sources[0].db}`;
}

const MediLab = {
    APP_CONFIG: config,
    APP_PORT: appPort,
    API_BASE_URL: apiBaseUrl,
    DB_URI: dbUri,
    ENVIRONMENT: ( process.env.NODE_ENV === 'production' ? 'production' : 'development' )
};

deepFreeze(MediLab);

global.MediLab = MediLab;

module.exports = MediLab;