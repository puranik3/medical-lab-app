var MediLab = MediLab || {};

MediLab.PackageTestService = {
    _path: MediLab.config.apiBaseUrl + '/packages',
    findMedicalTests: function( packageId, success, error ) {
        $.ajax({
            method: 'GET',
            url: this._path + '/' + packageId + '/medicaltests',
            success: success,
            error: error
        });
    },
    addMedicalTests: function( packageId, medicalTests, success, error ) {
        $.ajax({
            method: 'PUT',
            url: this._path + '/' + packageId + '/medicaltests',
            data: medicalTests,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    deleteMedicalTestById: function( packageId, medicalTestId, success, error ) {
        $.ajax({
            method: 'DELETE',
            url: this._path + '/' + packageId + '/' + 'medicaltests' + '/' + medicalTestId,
            success: success,
            error: error
        });
    }
};