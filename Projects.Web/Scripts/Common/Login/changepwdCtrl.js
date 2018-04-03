(function (app) {
    'use strict';

    app.controller('changepwdCtrl', changepwdCtrl);

    changepwdCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function changepwdCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.pageClass = 'page-login';
        $scope.ChangePWD = ChangePWD;
        $scope.user = {};
        $scope.msg = '';
        $scope.user.oldpwd = '';
        $scope.user.newpwd = '';

        function ChangePWD() {
            if ($scope.user.newpwd != $scope.user.confirmpassword) {
                notificationService.displayError("Password not confirmed!");
            }
            else {
                $scope.user = { 'userid': $rootScope.userid, oldpassword: $scope.user.oldpwd, password: $scope.user.newpwd };
                membershipService.changepassword($scope.user, changepwdCompleted)
            }

        }

        function changepwdCompleted(result) {
            if (result.data.success) {
                notificationService.displaySuccess('Password Changed Successfully!');
                //$scope.userData.displayUserInfo();
            }
            else {
                notificationService.displayError('Registration failed. Try again.');
            }
        }
    }

})(angular.module('common.core'));