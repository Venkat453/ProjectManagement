(function (app) {
    'use strict';
    app.controller('passwordVerificationCtrl', passwordVerificationCtrl);
    passwordVerificationCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal', '$modalInstance', '$route', 'currentUser'];
    function passwordVerificationCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal, $modalInstance, $route, currentUser) {
        
        alert(currentUser.userid);
        $scope.user = {};
        $scope.user.userid = currentUser.userid;
        $scope.closePopUp = function () {
            $modalInstance.close();
            $scope.user = {};
        }

        $scope.passwordVerification = function () {
            membershipService.login($scope.user, verificationCompleted)
        }
        function verificationCompleted(result) {
            if (result.data.success) {
                $modalInstance.close();
                $scope.user = {};
                $location.url("/Dashboard");
            }
            else {
                $scope.msg = 'Invalid UserID or Password.';
                notificationService.displayError('Sign in failed. Please try again.');
            }
        }
        function GetMenuList() {
            apiService.get('api/MenuAccess/GetMenuList/' + $rootScope.tenant.user_id, null, GetMenuListComplete, null);
        }

        function GetMenuListComplete(response) {
            $rootScope.MenuList = response.data;
            $sessionStorage.MenuList = $rootScope.MenuList;
        }


        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $rootScope.projectslists = response.data;
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('unable to get Project List');
        }
        $scope.forgotPassword = function () {
            $route.reload();
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Common/Login/forgotPassword.html',
                controller: 'forgotPasswordCtrl',
                scope: $scope,
            });
        };

    }
})(angular.module('common.core'));