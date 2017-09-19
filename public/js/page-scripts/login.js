(function () {
    if (MediLab.AuthService.isAuthenticated()) {
        window.location.pathname = '/';
    }

    $('#frm-login').on('submit', function ( $event ) {
        MediLab.AuthService.login(
            {
                email: $('#email').val(),
                password: $('#password').val()
            },
            function success(response) {
                window.location.pathname = '/';
            },
            function error(err) {
                alert('Unable to login - Incorrect email id or password.');
            }
        );
        $event.preventDefault();
    });
}());