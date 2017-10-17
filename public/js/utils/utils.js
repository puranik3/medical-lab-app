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
        return [date.toString().substr(4, 11), date.toTimeString()].join( dateTimeSeparator );
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
        return date.toTimeString();
    }
};