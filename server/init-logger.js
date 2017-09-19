var fs = require( 'fs' );
var winston = require('winston');

var logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: MediLab.ENVIRONMENT === 'development' ? 'debug' : 'info'
    })
  ]
});

module.exports = logger;