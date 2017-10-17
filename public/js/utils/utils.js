var MediLab = MediLab || {};

MediLab.Utils = {
    processError: function( err ) {
        alert( JSON.parse( err.responseText ).message );
        console.log( err );
    }
};