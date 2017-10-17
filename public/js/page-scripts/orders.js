(function() {
    var $btnInitiateReport = $( '.btn-initiate-report' );
    var $btnUpdateReport = $( '.btn-update-report' );
    var $btnFreezeReport = $( '.btn-freeze-report' );
    var $btnViewReport = $( '.btn-view-report' );

    var $btnUpdate = $( '.btn-update' );
    var $btnDelete = $( '.btn-delete' );

    var $updateOrderDialog = $( '#update-order-dialog' );
    var $updateTestResultsDialog = $( '#update-test-results-dialog' );
    var $printReportDialog = $( '#print-report-dialog' );

    var $btnUpdateOrder = $( '#btn-update-order' );
    var $btnUpdateTestResults = $( '#btn-update-test-results' );
    var $btnPrintReport = $( '#btn-print-report' );

    var $reportPatientName = $( '#report-patient-name' );
    var $reportPatientEmails = $( '#report-patient-emails' );
    var $reportPatientPhones = $( '#report-patient-phones' );

    var $reportOrderStatus = $( '#report-order-status' );
    var $reportOrderCreatedDate = $( '#report-order-createdDate' );
    var $reportOrderLastModifiedDate = $( '#report-order-lastModifiedDate' );

    var $reportReportStatus = $( '#report-report-status' );
    var $reportReportCreatedDate = $( '#report-report-createdDate' );
    var $reportReportLastModifiedDate = $( '#report-report-lastModifiedDate' );

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
            var choice = confirm( 'Are you sure you want to initiate the report for this order? The order will be frozen and you will not be able to add/remove tests and packages to/from the order once it is initiated.\n\nPress Cancel to cancel this operation. If you are sure you want to freeze the order and initiate report, press Ok.' );
            if( !choice ) {
                return;
            }
    
            MediLab.PatientService.orders.report.update(
                rowData.patient._id,
                rowData.order._id,
                [],
                'initiate',
                function( report ) {
                    if( report._status !== 'initiated' ) {
                        alert( 'Unknown error occured when trying to initiate report. Try again later.' );
                        return;
                    }

                    rowData.order.report = report;
                    $row.removeAttr( 'data-src' );
                    $row.data('src', rowData);
                    $row.find( '.cell-report-status' ).html( report._status );
                    $row.find( '.cell-report-createdDate .date' ).html( new Date( report.createdDate ).toString().substr(4, 11) );
                    $row.find( '.cell-report-createdDate .time' ).html( new Date( report.createdDate ).toTimeString() );
                    $row.find( '.cell-report-lastModifiedDate .date' ).html( new Date( report.lastModifiedDate ).toString().substr(4, 11) );
                    $row.find( '.cell-report-lastModifiedDate .time' ).html( new Date( report.lastModifiedDate ).toTimeString() );

                    alert( 'Report has been initiated. Addition/Removal of tests and packages shall not be allowed hereafter on this order' ) ;
                },
                MediLab.Utils.processError
            );
        } else {
            alert( 'Nothing to do - report for selected order has already been initiated' );
        }
    });

    $btnUpdateReport.add($btnViewReport).on('click', function() {
        $activatedRow = $( this ).closest( 'tr' );
    });

    $btnFreezeReport.on('click', function() {
        var $row = $( this ).closest( 'tr' );        
        var rowData = $row.data('src');

        if( rowData.order.report._status === 'uninitiated' ) {
            alert( 'Report for selected order has to be initiated first, before it can be frozen. Initiate the report and try again.' );
        } else if( rowData.order.report._status === 'completed' ) {
            alert( 'Nothing to do - report for selected order has already been frozen.' );
        } else if( rowData.order.report._status === 'initiated' ) {
            var choice = confirm( 'Are you sure you want to freeze the report for this order? You will not be able to change the test results in the report once it is frozen.\n\nPress Cancel to cancel this operation. If you are sure you want to freeze the report, press Ok.' );
            if( !choice ) {
                return;
            }
    
            MediLab.PatientService.orders.report.update(
                rowData.patient._id,
                rowData.order._id,
                [],
                'complete',
                function( report ) {
                    if( report._status !== 'completed' ) {
                        alert( 'Unknown error occured when trying to freeze report. Try again later.' );
                        return;
                    }

                    rowData.order.report = report;
                    $row.removeAttr( 'data-src' );
                    $row.data('src', rowData);
                    $row.find( '.cell-report-status' ).html( report._status );
                    $row.find( '.cell-report-lastModifiedDate .date' ).html( new Date( report.lastModifiedDate ).toString().substr(4, 11) );
                    $row.find( '.cell-report-lastModifiedDate .time' ).html( new Date( report.lastModifiedDate ).toTimeString() );

                    alert( 'Report has been frozen. No changes to report will be permitted hereafter.' ) ;
                },
                MediLab.Utils.processError
            );
        } else {
            alert( 'Report for selected order is in an unknown state. Contact admin to process this report.' );
        }
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
        $updateTestResultsDialogTableBody = $updateTestResultsDialog.find( 'tbody' );

        if( orderDetails.order.report._status === 'uninitiated' ) {
            $updateTestResultsDialog.modal( 'hide' );
            alert( 'Report for this order has not been initiated. Initiate the report first - then try again.' );
            return false;
        } else if( orderDetails.order.report._status === 'completed' ) {
            $updateTestResultsDialog.modal( 'hide' );
            alert( 'Report for this order has been frozen - you cannot modify the test results.' );
            return false;
        }

        var $tr = null;
        $updateTestResultsDialogTableBody.html( '' );
        $.each( orderDetails.order.report.results, function( index, resultItem ) {
            $tr = $(
                [
                    '<tr data-id="' + resultItem._id + '">',
                        '<td>' + resultItem.test.name + '</td>',
                        '<td>' + '<input type="text" class="result" value="' + resultItem.result + '" />' + '</td>',
                        '<td>' + resultItem.test.units + '</td>',
                        '<td>' + resultItem.test.lower_limit + '</td>',
                        '<td>' + resultItem.test.upper_limit + '</td>',
                    '</tr>'
                ].join('')
            );
            $updateTestResultsDialogTableBody.append( $tr );
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

    function generateUpdatedResults() {
        var rowDataClone = {};
        $.extend( true, rowDataClone, $activatedRow.data('src') );
        
        var $trs = $updateTestResultsDialog.find( 'tbody tr' );
        
        $trs.each(function() {
            $this = $( this );
            var resultId = $this.data( 'id' );
            for( var i = 0; i < rowDataClone.order.report.results.length; i++ ) {
                if( rowDataClone.order.report.results[i]._id === resultId ) {
                    rowDataClone.order.report.results[i].result = $this.find( '.result' ).val();
                    break;
                }
            }
        });

        return rowDataClone;
    }

    $btnUpdateTestResults.on('click', function() {
        var updatedTestResults = generateUpdatedResults();
        var rowData = $activatedRow.data('src');

        MediLab.PatientService.orders.report.update(
            rowData.patient._id,
            rowData.order._id,
            updatedTestResults.order.report.results,
            'draft',
            function( report ) {
                rowData.order.report = report;
                $activatedRow.removeAttr( 'data-src' );
                $activatedRow.data('src', rowData);

                $updateTestResultsDialog.modal( 'hide' );
                alert( 'Report has been successfully updated with the test results' ) ;
            },
            function( err ) {
                $updateTestResultsDialog.modal( 'hide' );
                MediLab.Utils.processError( err );
            }
        );
    });

    $printReportDialog.on( 'show.bs.modal', populateReportDialog );
    $printReportDialog.on( 'hidden.bs.modal', resetReportDialog );

    function populateReportDialog() {
        // associate report details with dialog
        var orderDetails = $activatedRow.data( 'src' );
        $printReportDialogTableBody = $printReportDialog.find( 'tbody' );

        if( orderDetails.order.report._status !== 'completed' ) {
            $printReportDialog.modal( 'hide' );
            alert( 'Report for this order has not yet been marked complete. Try viewing again once the report is marked complete.' );
            return false;
        }

        $reportPatientName.html( orderDetails.patient.name );
        $reportPatientEmails.html( orderDetails.patient.email.join(', ') );
        $reportPatientPhones.html( orderDetails.patient.phones.join(', ') );
    
        $reportOrderStatus.html( orderDetails.order._status );
        $reportOrderCreatedDate.html( MediLab.Utils.formatDateTime( orderDetails.order.createdDate, ' ' ) );
        $reportOrderLastModifiedDate.html( MediLab.Utils.formatDateTime( orderDetails.order.lastModifiedDate, ' ' ) );
    
        $reportReportStatus.html( orderDetails.order.report._status );
        $reportReportCreatedDate.html( MediLab.Utils.formatDateTime( orderDetails.order.report.createdDate, ' ' ) );
        $reportReportLastModifiedDate.html( MediLab.Utils.formatDateTime( orderDetails.order.report.lastModifiedDate, ' ' ) );

        var $tr = null;
        $.each( orderDetails.order.report.results, function( index, resultItem ) {
            $tr = $(
                [
                    '<tr>',
                        '<td>' + resultItem.test.name + '</td>',
                        '<td>' + resultItem.result + '</td>',
                        '<td>' + resultItem.test.units + '</td>',
                        '<td>' + resultItem.test.lower_limit + '</td>',
                        '<td>' + resultItem.test.upper_limit + '</td>',
                    '</tr>'
                ].join('')
            );
            $printReportDialogTableBody.append( $tr );
        });
    }

    function resetReportDialog() {
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