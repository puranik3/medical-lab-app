var MediLab = MediLab || {};

MediLab.CrudService = {
    setPathFragment( pathFragment ) {
        this._path = MediLab.config.apiBaseUrl + '/' + pathFragment;
    },
    getFullPath: function() {
        return this._path;
    },
    find: function( success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getFullPath(),
            success: success,
            error: error
        });
    },
    findById: function( id, success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getFullPath() + '/' + id,
            success: success,
            error: error
        });
    },
    create: function( dataObj, success, error ) {
        $.ajax({
            method: 'POST',
            url: this.getFullPath(),
            data: dataObj,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    updateById: function( id, dataObj, success, error ) {
        $.ajax({
            method: 'PUT',
            url: this.getFullPath() + '/' + id,
            data: dataObj,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    deleteById: function( id, success, error ) {
        $.ajax({
            method: 'DELETE',
            url: this.getFullPath() + '/' + id,
            success: success,
            error: error
        });
    }
};