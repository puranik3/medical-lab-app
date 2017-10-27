var fs = require('fs');
var pdf = require('html-pdf');
var path = require( 'path' );

var html = fs.readFileSync( path.join( __dirname, 'documents/reports/test-report.html' ), 'utf8' );

// Including image in header/footer
// https://stackoverflow.com/questions/35335698/add-image-in-header-using-html-pdf-node-module

console.log( path.join( __dirname, `documents/reports/templates/kumaran-lab/footer.png`) );

var config = {    
     "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
     "orientation": "portrait", // portrait or landscape

     "border": {
       "top": "0.75in",            // default is 0, units: mm, cm, in, px
       "right": "0.75in",
       "bottom": "0.75in",
       "left": "0.75in"
     },
    
     paginationOffset: 1,       // Override the initial pagination number
     
     "header": {
       "height": "45mm",
       "contents": `<div style="text-align: center;">` +
            `<img src=` + path.join( `./templates/kumaran-lab/header.png` ) + `" />` +
        `</div>`
     },
     
     "footer": {
       "height": "28mm",
       "contents": `<div style="text-align: center;">` +
            `<img src=` + path.join( `./templates/kumaran-lab/footer.png` ) + `" />` +
        `</div>`
     },

     "base": "file://" + __dirname,
    
    
     // Rendering options
     //"base": __dirname, // Base path that's used to load files (images, css, js) when they aren't referenced using a host
    
     // Zooming option, can be used to scale images if `options.type` is not pdf
     "zoomFactor": "1", // default is 1
    
     // File options
     "type": "pdf",             // allowed file types: png, jpeg, pdf
     "quality": "75",           // only used for types png & jpeg
    
     // Script options
     //"phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
     //"phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
     //"script": '/url',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
     "timeout": 30000,           // Timeout that will cancel phantomjs, in milliseconds
    
     // Time we should wait after window load
     // accepted values are 'manual', some delay in milliseconds or undefined to wait for a render event
     "renderDelay": 1000,
    
     // HTTP Headers that are used for requests
     "httpHeaders": {
       // e.g.
       //"Authorization": "Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B"
     },
    
     // To run Node application as Windows service
     "childProcessOptions": {
       //"detached": true
     },
    
     // HTTP Cookies that are used for requests
     "httpCookies": [
       // e.g.
       {
         "name": "Valid-Cookie-Name", // required
         "value": "Valid-Cookie-Value", // required
         "domain": "localhost",
         "path": "/foo", // required
         "httponly": true,
         "secure": false,
         "expires": (new Date()).getTime() + (1000 * 60 * 60) // e.g. expires in 1 hour
       }
     ]
};
 
pdf.create(html, config).toFile('./documents/reports/test-report.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/documents/reports/test-report.pdf' }
});