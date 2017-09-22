(function() {
    var $btnAddTests = $( '.btn-add-tests' );
    var $btnDeleteTest = $( '.btn-delete-test' );

    var $addTestsDialog = $( '#add-tests-dialog' );
    var $btnDialogAddTests = $( '#btn-add-tests' );

    var $packageList = $( '#package-list' );
    var $panelPackages = $( '.panel-package' );

    var $activatedRow;

    function renderMedicalTestsInPackagePanel( $panel, package ) {
        var $test;
        var $list = $panel.find( '.list-group-tests' );
        
        $list.empty();
        
        console.log( package.tests )

        package.tests.forEach(function( test, index ) {
            $test = $( '<li class="list-group-item">'/*+ ( index + 1 ) + '. '*/ + test.name + '</li>' );
            $test.append( $( '<span class="btn-delete-test close pull-right" data-id="' + test._id + '" title="Remove test from package">&times;</span>' ) );
            $list.append( $test );
        });

    }

    function addMedicalTestsInPackagePanel( $panel, medicalTests ) {
        var $test;
        var $list = $panel.find( '.list-group-tests' );

        medicalTests.forEach(function( medicalTest ) {
            $test = $( '<li class="list-group-item">'/*+ ( index + 1 ) + '. '*/ + medicalTest.name + '</li>' );
            $test.append( $( '<span class="btn-delete-test close pull-right" data-id="' + medicalTest._id + '" title="Remove test from package">&times;</span>' ) );
            $list.append( $test );
        });
    }

    $packageList.on( 'show.bs.collapse', '.panel-package', function() {
        var that = this;
        MediLab.PackageTestService.findMedicalTests(
            $(that).data( 'src' )._id,
            function( package ) {
                renderMedicalTestsInPackagePanel( $(that), package );
            },
            function( err ) {
                alert( 'Some error occured when trying to fetch tests for package' );
                console.log( err );
            }
        );
    });

    $packageList.on('click', '.btn-add-tests', function() {
        $activatedRow = $( this ).closest( '.panel' );
    });

    $packageList.on('click', '.btn-delete-test', function() {
        var choice = confirm( 'Are you sure you want to remove this test from the package?' );
        if( !choice ) {
            return;
        }

        var that = this;
        MediLab.PackageTestService.deleteMedicalTestById(
            $(that).closest( '.panel' ).data( 'src' )._id,
            $(that).data('id'),
            function( response ) {
                $(that).closest('li').remove();
            },
            function( err ) {
                alert( 'Some error occured when trying to remove test from package' );
                console.log( err );
            }
        );
    });

    $btnDialogAddTests.on('click', function() {
        addMedicalTests( 
            $activatedRow.data( 'src' )._id,
            [$('#tests').val()],
            [
                {
                    name: $( "#tests option:selected" ).text(),
                    id: $('#tests').val()
                }
            ]
        );
    });

    function addMedicalTests( packageId, medicalTests, medicalTestsWithDetails ) {
        MediLab.PackageTestService.addMedicalTests(
            packageId,
            medicalTests,
            function( package ) {
                medicalTests.forEach(function() {
                    addMedicalTestsInPackagePanel( $activatedRow, medicalTestsWithDetails );
                });
                $addTestsDialog.modal( 'hide' );
            },
            function( err ) {
                alert( 'Some error occured when trying to add test to package' );
                console.log( err );
            }
        );
    }
}());