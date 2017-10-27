var debug = require( 'debug' )( 'utils:utils' );

var fs = require('fs');
var path = require( 'path' );
var jade = require('jade');

var pdfModule = require('html-pdf');
var conversionFactory = require( 'phantom-html-to-pdf' );

function sendJsonErrorResponse( req, res, statusCode, message ) {
    debug( 'statusCode = %s, errMessage = %s', statusCode, message );
    return res.status(statusCode).json({
        "message": message
    });
}

function generateReport2( patient, order, outputFile, type ) {
    console.log( '*** ### ***' );
    console.log( 'patient = ', patient );
    console.log( '*** ### ***' );
    
    var html = jade.renderFile( path.join( __dirname, '../documents/reports/templates/report.jade' ), {
        patient: patient,
        order: order
    });

    if( type === 'application/pdf' ) {
        var conversion = conversionFactory({
            //host: '127.0.0.1',
            //header: '<h2>This is the header</h2>',
            phantomPath: require( 'phantomjs-prebuilt' ).path,
            allowLocalFilesAccess: true,
            paperSize: {
                format: 'A4',
                orientation: 'portrait',
                fitToPage: true
            }
        });
        
        // console.log( '*** image url ***' );
        // console.log(`<img src="` + `file://Users/admin/Documents/development/medilab/documents/reports/templates/kumaran-lab/header.png` + `" />`);
        // console.log( '*** generated report html ***' );
        // console.log( html );
        // console.log( '***' );

        conversion(
            {
                html: html,
                header: `<img src="` + `/Users/admin/Documents/development/medilab/documents/reports/templates/kumaran-lab/header.png` + `" />`,
                footer: '<div style="text-align:center">{#pageNum}/{#numPages}</div>',
            },
            function(err, pdf) {
                var output = fs.createWriteStream(outputFile);
                console.log(pdf.logs);
                console.log(pdf.numberOfPages);
                pdf.stream.pipe(output);
            }
        );
    }

    // fs.readFile(
    //     path.join( __dirname, 'documents/reports/test-report.html' ),
    //     'utf8',
    //     function( err, data ) {
    //         if( err ) {
    //             throw err;
    //         } else {
    //         }
    //     }
    // );
}

function generateReport( patient, order, outputFile, type ) {
    console.log( '*** ### ***' );
    console.log( 'patient = ', patient );
    console.log( '*** ### ***' );
    
    var html = jade.renderFile( path.join( __dirname, '../documents/reports/templates/report.jade' ), {
        patient: patient,
        order: order
    });
    var pathHeaderImage = path.join('file://', __dirname, `../documents/reports/templates/kumaran-lab/header.png` );
    var pathFooterImage = path.join('file://', __dirname, `../documents/reports/templates/kumaran-lab/footer.png` );
    html = html.replace('{{path-header-image}}', pathHeaderImage);
    html = html.replace('{{path-footer-image}}', pathFooterImage);
    
    if( type === 'application/pdf' ) {
        var config = {    
            "format": "A4",
            "orientation": "portrait",
       
            "border": {
              "top": "0in",
              "right": "0in",
              "bottom": "0in",
              "left": "0in"
            },
           
            paginationOffset: 1,
            
            // `<img src=` + path.join( `./templates/kumaran-lab/footer.png` ) + `" />` +
            "header": {
              "height": "45mm",
              "contents": `<div style="text-align: center; margin-bottom: 0.5in;">
                   <img src="${pathHeaderImage}" style="width: 100%;" />
               </div>`
            },
            
            "footer": {
              "height": "45mm",
              "contents": `<div style="text-align: center; margin-top: 0.5in;">
                    <div style="text-align:center; margin-bottom: 4px;">{{page}}/{{pages}}</div>
                    <div> 
                        <img src="${pathFooterImage}" style="width: 100%;" />
                    </div>
               </div>`
            },

            //"base": "file:///Users/admin/Documents/development/medilab",
            //"base": "file://" + __dirname,

            //"base": __dirname, // Base path that's used to load files (images, css, js) when they aren't referenced using a host

            "zoomFactor": "1",
            "type": "pdf",
            "quality": "75",
            "timeout": 30000,
            "renderDelay": 1000,
            "httpHeaders": {},
            "childProcessOptions": {},
            "httpCookies": [
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

    //    console.log( '*** image url ***' );
    //    console.log(`<img src="` + `file:///Users/admin/Documents/development/medilab/documents/reports/templates/kumaran-lab/header.png` + `" />`);
    //    console.log( '*** generated report html ***' );
    //    console.log( html );
    //    console.log( '***' );
        
       pdfModule.create(html, config).toFile(outputFile, function(err, res) {
         if (err) return console.log(err);
         console.log(res);
       });
    }
}

module.exports = {
    sendJsonErrorResponse,
    generateReport,
    generateReport2
};