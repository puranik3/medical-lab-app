var fs = require('fs');
var path = require( 'path' );

var conversion = require("phantom-html-to-pdf")({
    //host: '127.0.0.1',
    header: '<h2>This is the header</h2>',
    phantomPath: require("phantomjs-prebuilt").path,
    allowLocalFilesAccess: true,
    paperSize: {
        format: 'A4',
        orientation: 'portrait',
        fitToPage: true
    }
});

conversion(
    {
        html: "<h1>Hello World</h1>"
    },
    function(err, pdf) {
        var output = fs.createWriteStream( path.join( __dirname, 'output.pdf' ) );
        console.log(pdf.logs);
        console.log(pdf.numberOfPages);
        // since pdf.stream is a node.js stream you can use it
        // to save the pdf to a file (like in this example) or to
        // respond an http request.
        pdf.stream.pipe(output);
    }
);