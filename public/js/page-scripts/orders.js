(function() {
    var $btnInitiateReport = $( '.btn-initiate-report' );
    var $btnUpdateReport = $( '.btn-update-report' );
    var $btnUpdate = $( '.btn-update' );
    var $btnDelete = $( '.btn-delete' );

    var $updateOrderDialog = $( '#update-order-dialog' );
    var $updateTestResultsDialog = $( '#update-test-results-dialog' );

    var $btnUpdateOrder = $( '#btn-update-order' );
    var $btnUpdateTestResults = $( '#btn-update-test-results' );
    var $btnFreezeReport = $( '#btn-freeze-report' );

    var $activatedRow;

    /*
    $btnPlaceOrder.on( 'click', function() {
        var patientId = $activatedRow.data( 'src' )._id;

        MediLab.PatientService.orders.create(
            patientId,
            {},
            function( order ) {
                console.log( order );

                MediLab.PatientService.orders.medicalTestsAndPackages.add(
                    patientId,
                    order._id,
                    {
                        tests: selectedTests,
                        packages: selectedPackages
                    },
                    function( order ) {
                        $placeOrderDialog.modal( 'hide' );
                        alert( 'Order was placed successfully' );
                        console.log( order );
                    },
                    function( err ) {
                        $placeOrderDialog.modal( 'hide' );
                        alert( 'Order was created, but there was a problem adding tests and packages to it' );
                        console.log( err );
                    }
                );
            },
            function( err ) {
                $placeOrderDialog.modal( 'hide' );
                alert( 'Some error occured when trying to place order' );
                console.log( err );
            }
        );
    });

    function clearSelectedTestsAndPackages() {
        tests = null;
        packages = null;
        totalCost = 0;
        totalDiscount = 0;
        netAmount = 0;

        $search.val( '' );
        $search.trigger( 'input' );

        selectedTests = [];
        selectedPackages = [];

        $searchResultsTests.find( 'li' ).removeClass( 'selected' );
        $searchResultsPackages.find( 'li' ).removeClass( 'selected' );
    }

    $placeOrderDialog.on('show.bs.modal hidden.bs.modal', function() {
        clearSelectedTestsAndPackages();
    });

    $btnOrder.on('click', function() {
        $activatedRow = $( this ).closest( 'tr' );
    });

    $btnCreate.on('click', function() {
        modalState = 'create';
    });
    */
    $btnInitiateReport.on('click', function() {
        var $row = $( this ).closest( 'tr' );

        var rowData = $row.data('src');
        if( rowData.order.report._status === 'uninitiated' ) {
            MediLab.PatientService.orders.report.update(
                rowData.patient._id,
                rowData.order._id,
                [],
                'initiate',
                function( report ) {
                    console.log( report );
                    rowData.order.report = report;
                    $row.removeAttr( 'data-src' );
                    $row.data('src', rowData);
                    $row.find( '.cell-report-status' ).html( report._status );
                    $row.find( '.cell-report-createdDate' ).html( new Date( report.createdDate ).toString().substr(4, 11) );
                    $row.find( '.cell-report-lastModifiedDate' ).html( new Date( report.lastModifiedDate ).toString().substr(4, 11) );

                    alert( 'Report has been initiated. Addition/Removal of tests and packages shall not be allowed hereafter on this order' ) ;
                },
                function( err ) {
                    alert( 'Some error occured while trying to initiate report.' );
                    console.log( err );
                }
            );        
        } else {
            alert( 'Nothing to do - report for selected order has already been initiated' );
        }
    });

    $btnUpdateReport.on('click', function() {
        $activatedRow = $( this ).closest( 'tr' );
    });
    
    /*
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
    */

    $updateTestResultsDialog.on( 'show.bs.modal', populateTestDetailsInDialog );
    $updateTestResultsDialog.on( 'hidden.bs.modal', resetUpdateTestResultsDialog );

    function populateTestDetailsInDialog() {
        // associate report details with dialog
        var orderDetails = $activatedRow.data( 'src' );
        $btnUpdateTestResultsTableBody = $btnUpdateTestResults.find( 'tbody' );

        if( orderDetails.order.report._status === 'uninitiated' ) {
            $updateTestResultsDialog.modal( 'hide' );
            alert( 'Report for this order has not been initiated. Initiate the report first - then try again.' );
            return false;
        }

        var $tr = null;
        $btnUpdateTestResultsTableBody.html( '' );
        $.each( orderDetails.order.report.results, function( index, result ) {
            $tr = $(
                [
                    '<tr>',
                        '<td>' + '' + '</td>',
                        '<td>' + '' + '</td>',
                        '<td>' + '' + '</td>',
                        '<td>' + '' + '</td>',
                        '<td>' + '' + '</td>',
                    '</tr>'
                ].join('')
            );
        });
        
        /*
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
        */
    }

    function resetUpdateTestResultsDialog() {
        // dissassociate patients details from dialog
        /*
        $createUpdateDialog.find( '#name' ).val( '' );
        $createUpdateDialog.find( '#dob' ).val( '' );
        $createUpdateDialog.find( '#sex' ).val( '' );
        $createUpdateDialog.find( '#phones input[type="tel"]' ).val( '' );
        $createUpdateDialog.find( '#emails input[type="email"]' ).val( '' );
        
        $createUpdateDialog.find( '#phones input[type="tel"][readonly]' ).remove();
        $createUpdateDialog.find( '#emails input[type="email"][readonly]' ).remove();
        */
    }

    /*
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
    */
}());