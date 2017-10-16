var MediLab = MediLab || {};

MediLab.CrudService = {
    setPathFragment( pathFragment ) {
        this._path = MediLab.config.apiBaseUrl + '/' + pathFragment;
    },
    getPath: function() {
        return this._path;
    },
    getPathById: function( id ) {
        return [this.getPath(), id].join( '/' )
    },
    find: function( success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getPath(),
            success: success,
            error: error
        });
    },
    findById: function( id, success, error ) {
        $.ajax({
            method: 'GET',
            url: this.getPathById( id ),
            success: success,
            error: error
        });
    },
    create: function( dataObj, success, error ) {
        $.ajax({
            method: 'POST',
            url: this.getPath(),
            data: dataObj,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    updateById: function( id, dataObj, success, error ) {
        $.ajax({
            method: 'PUT',
            url: this.getPathById( id ),
            data: dataObj,
            dataType: 'json',
            success: success,
            error: error
        });
    },
    deleteById: function( id, success, error ) {
        $.ajax({
            method: 'DELETE',
            url: this.getPathById( id ),
            success: success,
            error: error
        });
    }
};