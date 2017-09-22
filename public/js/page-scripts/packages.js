(function() {
    var $btnCreate = $( '#btn-create' );
    var $btnUpdate = $( '.btn-update' );
    var $btnDelete = $( '.btn-delete' );

    var $createUpdateDialog = $( '#create-update-dialog' );
    var $btnCreateUpdate = $( '#btn-create-update' );

    var modalState = 'create';
    var $activatedRow;

    $btnCreate.on('click', function() {
        modalState = 'create';
    });

    $btnUpdate.on('click', function() {
        modalState = 'update';
        $activatedRow = $( this ).closest( '.panel' );
    });

    $btnDelete.on('click', function() {
        var choice = confirm( 'Are you sure you want to remove this package from your records? You cannot undo this action.\n\nPress Cancel to cancel this operation. If you are sure you want to remove, press Ok.' );
        if( !choice ) {
            return;
        }

        var that = this;
        MediLab.PackageService.deleteById(
            $(that).data('id'),
            function( packages ) {
                console.log( $(this).closest('.panel') );
                $(that).closest('.panel').remove();
            },
            function( err ) {
                alert( 'Some error occured when trying to remove package' );
                console.log( err );
            }
        );
    });

    $createUpdateDialog.on('show.bs.modal', function() {
        if( modalState === 'create' ) {
            $( this ).find( '.modal-title' ).text( 'Add Package Details' );
            $btnCreateUpdate.text( 'Add Package' );
        } else {
            $( this ).find( '.modal-title' ).text( 'Update Package Details' );
            $btnCreateUpdate.text( 'Update' );
            populatePackageDetailsInDialog();
        }
    });

    $createUpdateDialog.on('hidden.bs.modal', function() {
        resetPackageDialog();
    });

    function populatePackageDetailsInDialog() {
        // associate package details with dialog
        var package = $activatedRow.data( 'src' )
        $createUpdateDialog.find( '#name' ).val( package.name );
        $createUpdateDialog.find( '#price' ).val( package.price );
        $createUpdateDialog.find( '#discountAmount' ).val( package.discountAmount );
        $createUpdateDialog.find( '#discountStrategy' ).val( package.discountStrategy );
    }

    function resetPackageDialog() {
        // dissassociate package details from dialog
        $createUpdateDialog.find( '#name' ).val( '' );
        $createUpdateDialog.find( '#price' ).val( '' );
        $createUpdateDialog.find( '#discountAmount' ).val( '' );
        $createUpdateDialog.find( '#discountStrategy' ).val( '' );
    }

    $btnCreateUpdate.on('click', function() {
        var packageId = modalState === 'create' ? null : $activatedRow.data( 'src' )._id;

        // get the package details out of dialog
        var packageObj = {
            name: $createUpdateDialog.find( '#name' ).val(),
            price: $createUpdateDialog.find( '#price' ).val(),
            discountAmount: $createUpdateDialog.find( '#discountAmount' ).val(),
            discountStrategy: $createUpdateDialog.find( '#discountStrategy' ).val()
        };

        console.log( packageObj );
        createUpdatePackageDetails( packageId, packageObj )
    });

    function createUpdatePackageDetails( packageId, packageObj ) {
        var that = this;
        
        if( modalState === 'create' ) {
            MediLab.PackageService.create(
                packageObj,
                function( packages ) {
                    window.location.reload();
                },
                function( err ) {
                    alert( 'Some error occured when trying to add package' );
                    console.log( err );
                }
            );
        } else {
            MediLab.PackageService.updateById(
                packageId,
                packageObj,
                function( packages ) {
                    window.location.reload();
                },
                function( err ) {
                    alert( 'Some error occured when trying to update package details' );
                    console.log( err );
                }
            );
        }
    }
}());