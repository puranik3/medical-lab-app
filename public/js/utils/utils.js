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
    }
};