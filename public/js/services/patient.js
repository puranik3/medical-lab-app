var MediLab = MediLab || {};

MediLab.PatientService = Object.create( MediLab.CrudService );
MediLab.PatientService.setPathFragment( 'patients' );

MediLab.PatientService.orders = {
    getPath: function( patientId ) {
        return [MediLab.PatientService.getPathById( patientId ), 'orders'].join( '/' );
    },
    getPathById: function( patientId, orderId ) {
        return [this.getPath( patientId ), orderId].join( '/' );
    },
    find: function( patientId, success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getPath( patientId ),
            success: success,
            error: error
        });
    },
    findById: function( patientId, orderId, success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getPathById( patientId, orderId ),
            success: success,
            error: error
        });
    },
    create: function( patientId, order, success, error ) {
        $.ajax({
            method: 'POST',
            url: this.getPath( patientId ),
            data: order,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    updateById: function( patientId, orderId, order, success, error ) {
        $.ajax({
            method: 'PUT',
            url: this.getPathById( patientId, orderId ),
            data: order,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    deleteById: function( patientId, orderId, success, error ) {
        $.ajax({
            method: 'DELETE',
            url: this.getPathById( patientId, orderId ),
            success: success,
            error: error
        });
    }
};

MediLab.PatientService.orders.medicalTestsAndPackages = {
    getPath: function( patientId, orderId ) {
        return [MediLab.PatientService.orders.getPathById( patientId, orderId ), 'medicaltestsandpackages'].join( '/' );
    },
    getPathById: function( patientId, orderId, medicalTestOrPackageId ) {
        return [this.getPath( patientId, orderId ), medicalTestOrPackageId].join( '/' );
    },
    find: function( patientId, orderId, success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getPath( patientId, orderId ),
            success: success,
            error: error
        });
    },
    add: function( patientId, orderId, medicalTestsAndPackages, success, error ) {
        $.ajax({
            method: 'PUT',
            url: this.getPath( patientId, orderId ),
            data: medicalTestsAndPackages,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    // type = 'medicaltest' | 'package'
    deleteById: function( patientId, orderId, medicalTestOrPackageId, type, success, error ) { 
        $.ajax({
            method: 'DELETE',
            url: this.getPathById( patientId, orderId, medicalTestOrPackageId ) + '?' + $.param({ type: type }),
            success: success,
            error: error
        });
    }
}

MediLab.PatientService.orders.report = {
    getPath: function( patientId, orderId ) {
        return [MediLab.PatientService.orders.getPathById( patientId, orderId ), 'report'].join( '/' );
    },
    find: function( patientId, orderId, success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getPath( patientId, orderId ),
            success: success,
            error: error
        });
    },
    // action = 'initiate' | 'draft' | 'complete'
    update: function( patientId, orderId, results, action, success, error ) {
        $.ajax({
            method: 'PUT',
            url: this.getPath( patientId, orderId ) + '?' + $.param({ action: action }),
            data: results,
            dataType: 'json',
            success: success,
            error: error
        });
    }
}