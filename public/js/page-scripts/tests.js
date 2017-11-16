(function() {
    var $btnCreate = $( '#btn-create' );
    var $btnUpdate = $( '.btn-update' );
    var $btnDelete = $( '.btn-delete' );

    var $previousTests = $( '#previous-tests' );
    var $nextTests = $( '#next-tests' );

    var $createUpdateDialog = $( '#create-update-dialog' );
    var $btnCreateUpdate = $( '#btn-create-update' );

    var modalState = 'create';
    var $activatedRow;

    $btnCreate.on('click', function() {
        modalState = 'create';
    });

    $btnUpdate.on('click', function() {
        modalState = 'update';
        $activatedRow = $( this ).closest( 'tr' );
    });

    $btnDelete.on('click', function() {
        var choice = confirm( 'Are you sure you want to remove this test? You cannot undo this action.\n\nPress Cancel to cancel this operation. If you are sure you want to remove, press Ok.' );
        if( !choice ) {
            return;
        }

        var that = this;
        MediLab.MedicalTestService.deleteById(
            $(that).data('id'),
            function( tests ) {
                console.log( $(this).closest('tr') );
                $(that).closest('tr').remove();
            },
            function( err ) {
                alert( 'Some error occured when trying to remove test' );
                console.log( err );
            }
        );
    });

    $createUpdateDialog.on('show.bs.modal', function() {
        if( modalState === 'create' ) {
            $( this ).find( '.modal-title' ).text( 'Add Test Details' );
            $btnCreateUpdate.text( 'Add Test' );
        } else {
            $( this ).find( '.modal-title' ).text( 'Update Test Details' );
            $btnCreateUpdate.text( 'Update' );
            populateTestDetailsInDialog();
        }
    });

    $createUpdateDialog.on('hidden.bs.modal', function() {
        resetTestDialog();
    });

    function populateTestDetailsInDialog() {
        // associate test details with dialog
        var test = $activatedRow.data( 'src' )
        $createUpdateDialog.find( '#name' ).val( test.name );
        $createUpdateDialog.find( '#lower_limit' ).val( test.lower_limit );
        $createUpdateDialog.find( '#upper_limit' ).val( test.upper_limit );
        $createUpdateDialog.find( '#units' ).val( test.units );
    }

    function resetTestDialog() {
        // dissassociate test details from dialog
        $createUpdateDialog.find( '#name' ).val( '' );
        $createUpdateDialog.find( '#lower_limit' ).val( '' );
        $createUpdateDialog.find( '#upper_limit' ).val( '' );
        $createUpdateDialog.find( '#units' ).val( '' );
    }

    $btnCreateUpdate.on('click', function() {
        var testId = modalState === 'create' ? null : $activatedRow.data( 'src' )._id;

        // get the test details out of dialog
        var testObj = {
            name: $createUpdateDialog.find( '#name' ).val(),
            lower_limit: $createUpdateDialog.find( '#lower_limit' ).val(),
            upper_limit: $createUpdateDialog.find( '#upper_limit' ).val(),
            units: $createUpdateDialog.find( '#units' ).val(),
        };

        console.log( testObj );
        createUpdateTestDetails( testId, testObj )
    });

    function createUpdateTestDetails( testId, testObj ) {
        var that = this;
        
        if( modalState === 'create' ) {
            MediLab.MedicalTestService.create(
                testObj,
                function( tests ) {
                    window.location.reload();
                },
                function( err ) {
                    alert( 'Some error occured when trying to add test' );
                    console.log( err );
                }
            );
        } else {
            MediLab.MedicalTestService.updateById(
                testId,
                testObj,
                function( tests ) {
                    window.location.reload();
                },
                function( err ) {
                    alert( 'Some error occured when trying to update test details' );
                    console.log( err );
                }
            );
        }
    }

    /*
    $previousTests.on('click', function() {
        var currentPage = MediLab.Utils.getQueryStringParams().page || 0;
        var previousPage = Math.max( +currentPage - 1, 0 );
        window.location.assign( '//' + window.location.host + window.location.pathname + '?page=' + previousPage );
    });

    $nextTests.on('click', function() {
        var currentPage = MediLab.Utils.getQueryStringParams().page || 0;
        var nextPage = +currentPage + 1;
        window.location.assign( '//' + window.location.host + window.location.pathname + '?page=' + nextPage );
    });
    */
}());