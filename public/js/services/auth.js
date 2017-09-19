var MediLab = MediLab || {};

MediLab.AuthService = (function () {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.headers = options.header || {};
        options.headers.authorization = 'Bearer ' + MediLab.AuthService.getToken();
    });
    
    function isAuthenticated() {
        return !!MediLab.AuthService.getToken();
    }

    function getToken() {
        return localStorage.getItem('authToken');
    }

    function setToken( token, email ) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('email', email);
    }

    function removeToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('email');
    }

    function getEmail() {
        return localStorage.getItem('email');
    }

    /**
     * @param {String} credentials.email
     * @param {String} credentials.password
     */
    function login(credentials, success, error) {
        $.ajax({
            method: 'post',
            url: '/api/auth/login',
            data: credentials,
            dataType: 'json',
            success: function (response) {
                MediLab.AuthService.setToken(response.authToken, response.email);
                success(response);
            },
            error: function (err) {
                console.log(err);
                error(err);
            }
        });
    }

    function logout() {
        $.ajax({
            method: 'post',
            url: '/api/auth/logout',
            success: function (response) {
                MediLab.AuthService.removeToken();
                window.location.pathname = '/login';
            },
            error: function (err) {
                console.log(err);
                error(err);
            }
        });
    }

    return {
        isAuthenticated: isAuthenticated,
        getToken: getToken,
        setToken: setToken,
        removeToken: removeToken,
        getEmail: getEmail,
        login: login,
        logout: logout
    };
}());