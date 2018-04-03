(function (app) {
    'use strict';
    app.filter('startFrom', function () {
        return function (input, start) {
            return input.slice(start);
        };
    });
    app.controller('forgotPasswordCtrl', forgotPasswordCtrl);

    forgotPasswordCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance'];

    function forgotPasswordCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance) {

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        };
        $scope.user = {};
        $scope.emailcheck = false;

        $scope.checkemail = function () {
            apiService.post('api/account/ForgotPassword', $scope.user, CheckEmailComplete, CheckEmailFailed);
        };
        function CheckEmailComplete() {
            notificationService.displaySuccess("Email is exits!!!");
            $scope.emailcheck = true;
        }

        function CheckEmailFailed() {
            notificationService.displayError("Email is not exits!!!");
        }


        $scope.forgotPassword = function () {
            apiService.post('api/account/ForgotPassword', $scope.user, ChangePasswordComplete, ChangePasswordFailed);
        };

        function ChangePasswordComplete()
        {
            notificationService.displaySuccess("Password Change Success!!!");
        }

        function ChangePasswordFailed()
        {
                notificationService.displayError("Password Change Failed. Please try again!!!");  
        }
    }

})(angular.module('common.core'));