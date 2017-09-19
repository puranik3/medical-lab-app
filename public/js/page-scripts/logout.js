(function () {
    $('#btn-logout').on('click', function () {
        MediLab.AuthService.logout();
    });
}());