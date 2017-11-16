var MediLab = MediLab || {};

MediLab.Utils = {
    processError: function( err ) {
        alert( JSON.parse( err.responseText ).message );
        console.log( err );
    },
    formatDateTime: function( date, dateTimeSeparator ) {
        if( typeof date === 'string' ) {
            date = new Date( date );
        }
        return [date.toString().substr(4, 11), date.toTimeString().substr(0,8)].join( dateTimeSeparator );
    },
    formatDate: function( date ) {
        if( typeof date === 'string' ) {
            date = new Date( date );
        }
        return date.toString().substr(4, 11);
    },
    formatTime: function( date ) {
        if( typeof date === 'string' ) {
            date = new Date( date );
        }
        return date.toTimeString().substr(0,8);
    },
    /**
     * In case a portion of an document is to be printed, pass the id of the element container for argument doc.
     * Else pass the path to the document on the server.
     */
    print: function printDiv( doc, isElement ) {
        var w;

        if( isElement ) {
            w = window.open();
            var printContents = document.getElementById( doc ).innerHTML;
            w.document.write( printContents );
            w.print();
            w.close();
        } else {
            w = window.open( doc );
            w.onload = function() {
                w.print();
            };
            w.onafterprint = function() {
                w.close();
            };
        }
    },
    // https://stackoverflow.com/questions/7731778/get-query-string-parameters-with-jquery
    getQueryStringParams: function() {
        var queryString = {};
        var pairs = location.search.substr( 1 ).split( '&' );
        $.each(pairs, function (index, pair) {
            if (pair === '' ) {
                return;
            }

            var parts = pair.split( '=' );
            queryString[parts[0]] = parts[1] &&
                decodeURIComponent(parts[1].replace( /\+/g, ' ' ) );
        });

        return queryString;
    }
};