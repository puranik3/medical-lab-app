(function() {
    var $btnCreate = $( '#btn-create' );
    var $btnUpdate = $( '.btn-update' );
    var $btnDelete = $( '.btn-delete' );

    var $createUpdateDialog = $( '#create-update-dialog' );

    var $phones = $( '#phones' );
    var $emails = $( '#emails' );
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
        var choice = confirm( 'Are you sure you want to remove this patient from your records? You cannot undo this action.\n\nPress Cancel to cancel this operation. If you are sure you want to remove, press Ok.' );
        if( !choice ) {
            return;
        }

        var that = this;
        MediLab.PatientService.deleteById(
            $(that).data('id'),
            function( patients ) {
                console.log( $(this).closest('tr') );
                $(that).closest('tr').remove();
            },
            function( err ) {
                alert( 'Some error occured when trying to remove patient' );
                console.log( err );
            }
        );
    });

    function addPhone() {
        $( this ).removeClass( 'btn-add-phone fa-plus' ).addClass( 'btn-remove-phone fa-minus' );
        $( this ).prev( 'input[type="tel"]' ).attr( 'readonly', true );
        $phones.append( $( '<div class="input-padded-right"><input type="tel" placeholder="eg. +91-9448441480" class="form-control"><i class="btn-action btn-add-phone fa fa-plus"></i></div>' ) );
    }

    function removePhone() {
        $( this ).closest( '.input-padded-right' ).remove();
    }

    $phones.on('click', '.btn-add-phone', addPhone);
    $phones.on('click', '.btn-remove-phone', removePhone);

    function addEmail() {
        $( this ).removeClass( 'btn-add-email fa-plus' ).addClass( 'btn-remove-email fa-minus' );
        $( this ).prev( 'input[type="email"]' ).attr( 'readonly', true );
        $emails.append( $( '<div class="input-padded-right"><input type="email" placeholder="eg. ravi.kumar@gmail.com" class="form-control"><i class="btn-action btn-add-email fa fa-plus"></i></div>' ) );
    }

    function removeEmail() {
        $( this ).closest( '.input-padded-right' ).remove();
    }

    $emails.on('click', '.btn-add-email', addEmail);
    $emails.on('click', '.btn-remove-email', removeEmail);

    $createUpdateDialog.on('show.bs.modal', function() {
        if( modalState === 'create' ) {
            $( this ).find( '.modal-title' ).text( 'Add Patient Details' );
            $btnCreateUpdate.text( 'Add Patient' );
        } else {
            $( this ).find( '.modal-title' ).text( 'Update Patient Details' );
            $btnCreateUpdate.text( 'Update' );
            populatePatientDetailsInDialog();
        }
    });

    $createUpdateDialog.on('hidden.bs.modal', function() {
        resetPatientDialog();
    });

    function populatePatientDetailsInDialog() {
        // associate patients details with dialog
        var patient = $activatedRow.data( 'src' )
        $createUpdateDialog.find( '#name' ).val( patient.name );
        $createUpdateDialog.find( '#dob' ).val( patient.dob.substring(0, 10) );
        $createUpdateDialog.find( '#sex' ).val( patient.sex );
        $.each( patient.phones, function( index, phone ) {
            $btnAddPhone = $( '.btn-add-phone' );
            $btnAddPhone.removeClass( 'btn-add-phone fa-plus' ).addClass( 'btn-remove-phone fa-minus' );
            $btnAddPhone.prev( 'input[type="tel"]' ).val( phone ).attr( 'readonly', true );
            $phones.append( $( '<div class="input-padded-right"><input type="tel" placeholder="eg. +91-9448441480" class="form-control"><i class="btn-action btn-add-phone fa fa-plus"></i></div>' ) );
        });
        $.each( patient.emails, function( index, email ) {
            $btnAddEmail = $( '.btn-add-email' );
            $btnAddEmail.removeClass( 'btn-add-email fa-plus' ).addClass( 'btn-remove-email fa-minus' );
            $btnAddEmail.prev( 'input[type="email"]' ).val( email ).attr( 'readonly', true );
            $emails.append( $( '<div class="input-padded-right"><input type="email" placeholder="eg. ravi.kumar@gmail.com" class="form-control"><i class="btn-action btn-add-email fa fa-plus"></i></div>' ) );
        });
    }

    function resetPatientDialog() {
        // dissassociate patients details from dialog
        $createUpdateDialog.find( '#name' ).val( '' );
        $createUpdateDialog.find( '#dob' ).val( '' );
        $createUpdateDialog.find( '#sex' ).val( '' );
        $createUpdateDialog.find( '#phones input[type="tel"]' ).val( '' );
        $createUpdateDialog.find( '#emails input[type="email"]' ).val( '' );
        
        $createUpdateDialog.find( '#phones input[type="tel"][readonly]' ).remove();
        $createUpdateDialog.find( '#emails input[type="email"][readonly]' ).remove();
    }

    $btnCreateUpdate.on('click', function() {
        var patientId = modalState === 'create' ? null : $activatedRow.data( 'src' )._id;

        // get the patient details out of dialog
        var patientObj = {
            name: $createUpdateDialog.find( '#name' ).val(),
            dob: $createUpdateDialog.find( '#dob' ).val(),
            sex: $createUpdateDialog.find( '#sex' ).val(),
            phones: (function() {
                var phones = [];
                $( '#phones input[type="tel"][readonly]' ).each(function() {
                    phones.push( $(this).val() );
                });
                return phones;
            }()),
            emails: (function() {
                var emails = [];
                $( '#emails input[type="email"][readonly]' ).each(function() {
                    emails.push( $(this).val() );
                });
                return emails;
            }())
        };

        console.log( patientObj );
        createUpdatePatientDetails( patientId, patientObj )
    });

    function createUpdatePatientDetails( patientId, patientObj ) {
        var that = this;
        
        if( modalState === 'create' ) {
            MediLab.PatientService.create(
                patientObj,
                function( patients ) {
                    window.location.reload();
                },
                function( err ) {
                    alert( 'Some error occured when trying to add patient' );
                    console.log( err );
                }
            );
        } else {
            MediLab.PatientService.updateById(
                patientId,
                patientObj,
                function( patients ) {
                    window.location.reload();
                },
                function( err ) {
                    alert( 'Some error occured when trying to update patient details' );
                    console.log( err );
                }
            );
        }
    }
}());