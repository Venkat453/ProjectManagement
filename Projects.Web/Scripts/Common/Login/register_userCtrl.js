(function (app) {
    'use strict';

    app.controller('register_userCtrl', register_userCtrl);

    register_userCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function register_userCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.pageClass = 'page-login';
        $scope.register = register;
        $scope.user = {};
        $scope.DeleteUserList = DeleteUserList;

        GetRolesList();
        function GetRolesList() {
            apiService.get('api/account/getroles', null, RolesLoadComplete, RolesLoadFailed);
        }

        function RolesLoadComplete(response) {
            $scope.rolesList = response.data;
        }

        function RolesLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        BindUsersGrid();
        function BindUsersGrid() {
            apiService.get('api/account/GetMyUsers/' + $rootScope.tenant.tenant_id, null, UsersLoadComplete, UsersLoadFailed);
        }

        function DeleteUserList(u)
        {
            alert(u.userID);

            membershipService.deleteuser(u.userID, deleteCompleted);
        }

        function UsersLoadComplete(response) {
            $scope.UsersList = response.data;

            $scope.totalItems = $scope.UsersList.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 10;

            $scope.paginate = function (value) {
                var begin, end, index;
                begin = ($scope.currentPage - 1) * $scope.numPerPage;
                end = begin + $scope.numPerPage;
                index = $scope.UsersList.indexOf(value);
                return (begin <= index && index < end);
            };
        }

        function UsersLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function register() {
            $scope.user.tenant_id = $rootScope.tenant.tenant_id;
            $scope.user.password = $scope.user.pwd;
            $scope.user.Roleid = $scope.roles.id;
            $scope.user.is_tenant = false;
            //$scope.user.mail2tenant = true;
            //$scope.user.mail2user = true;
            membershipService.register($scope.user, registerCompleted)
        }

        function registerCompleted(result) {
            if (result.data.success) {
                notificationService.displaySuccess($scope.user.userid + ' is Registered successfully!');
                //$scope.userData.displayUserInfo();
                //$location.path('/');
                BindUsersGrid();
            }
            else {
                notificationService.displayError('Registration failed. Try again.');
            }
        }

        function deleteCompleted(result) {
            if (result.data.success) {
                //membershipService.saveCredentials($scope.user);
                notificationService.displaySuccess($scope.user.userid + ' is Deleted successfully!');
                //$scope.userData.displayUserInfo();
                //$location.path('/');
                BindUsersGrid();
            }
            else {
                notificationService.displayError('User Deletion failed. Try again.');
            }
        }
    }

})(angular.module('common.core'));