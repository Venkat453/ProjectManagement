(function (app) {
    'use strict';

    app.factory('membershipService', membershipService);

    membershipService.$inject = ['apiService', 'notificationService', '$http', '$base64', '$cookieStore', '$rootScope','$sessionStorage'];

    function membershipService(apiService, notificationService, $http, $base64, $cookieStore, $rootScope, $sessionStorage) {

        var service = {
            login: login,
            register: register,
            changepassword:changepassword,
            saveCredentials: saveCredentials,
            removeCredentials: removeCredentials,
            isUserLoggedIn: isUserLoggedIn
        }

        function login(user, completed) {
            apiService.post('/api/account/authenticate', user,
            completed,
            loginFailed);
        }

        function register(user, completed) {
            apiService.post('/api/account/register', user,
            completed,
            registrationFailed);
        }

        function deleteuser(user, completed) {
            apiService.post('/api/account/DeleteUser', user,
            completed,
            deleteFailed);
        }

        function changepassword(user, completed) {
            apiService.post('/api/account/changePWD', user,
            completed,
            changepasswordFailed);
        }

        function saveCredentials(user) {
            var membershipData = $base64.encode(user.userid + ':' + user.password);

            $rootScope.repository = {
                loggedUser: {
                    userid: user.userid,
                    authdata: membershipData
                }
            };
            $sessionStorage.repository = $rootScope.repository;
            $sessionStorage.repository.userid = $rootScope.repository.loggedUser.userid;
            $sessionStorage.repository.authdata = $rootScope.repository.loggedUser.authdata;
            $rootScope.userid = user.userid;

            $http.defaults.headers.common['Authorization'] = 'Basic ' + membershipData;
            $cookieStore.put('repository', $rootScope.repository);
        }

        function removeCredentials() {
            $rootScope.repository = {};
            $cookieStore.remove('repository');
            $http.defaults.headers.common.Authorization = '';
        };

        function loginFailed(response) {
            notificationService.displayError('Login Failed! Please try again or contact the administrator.');
        }

        function registrationFailed(response) {

            if (response.data == 'Failure sending mail.') {
              
                notificationService.displaySuccess("Registration success but Failure sending mail");
               
            }
            else
            {
                notificationService.displayError('Registration failed. Try again........!');
            }
           
        }

        function changepasswordFailed(response) {

            notificationService.displayError('Change Password failed. Try again.');
        }

        function isUserLoggedIn() {
            //return $rootScope.repository.loggedUser != null;
            return $rootScope.repository = $sessionStorage.repository;
            
        }

        return service;
    }



})(angular.module('common.core'));