(function (app) {
    'use strict';

    app.controller('createuserCtrl', createuserCtrl);

    createuserCtrl.$inject = ['$scope', 'apiService', '$filter', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function createuserCtrl($scope, apiService,$filter, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.toggle = true;
        $scope.newUser = {};
        $scope.rolesList = [];
        $scope.myUsers = [];


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

        $scope.showRole = function (roleid) {
            var selected = $filter('filter')($scope.rolesList, { id: roleid });
            return (roleid && selected.length) ? selected[0].Name : 'Not set';
        };

        BindUsersGrid();
        function BindUsersGrid() {
            apiService.get('api/account/GetMyUsers/' + $rootScope.tenant.tenant_id, null, UsersLoadComplete, UsersLoadFailed);
        }

        function DeleteUserList(u) {
            membershipService.deleteuser(u.userID, deleteCompleted);
        }

        function UsersLoadComplete(response) {
            $scope.myUsers = response.data;
        }

        function UsersLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        $scope.registerNewUser = function () {
            $scope.newUser.tenant_id = $rootScope.tenant.tenant_id;
            $scope.newUser.is_tenant = false;
            $scope.newUser.password = $scope.newUser.pwd;
            $scope.newUser.Roleid = $scope.roles.id;
            membershipService.register($scope.newUser, registerCompleted)
        };

        function registerCompleted(result) {
            if (result.data.success) {
                notificationService.displaySuccess($scope.newUser.userid + ' is Registered successfully!');
                BindUsersGrid();
            }
            else {
                notificationService.displayError('Registration failed. Try again.');
            }
        }

        $scope.toggleReadonly = false;
        $scope.viewUserInfo = function (viewInfo) {
            $scope.toggleReadonly = true;
            $scope.newUser.userid = viewInfo.userid;
            $scope.newUser.username = viewInfo.user_name;
            $scope.newUser.email = viewInfo.email;
        };
        
        $scope.updateUserInfo = {};
        $scope.showRegister = true;
        $scope.showEdit = true;
        $scope.showUpdate = false;
        $scope.eidtUser = function (userInfo) {
            alert(userInfo.roleid);
            $scope.showRegister = false;
            $scope.showEdit = false;
            $scope.showUpdate = true;
            $scope.toggleReadonly = false;
            $scope.newUser.userid = userInfo.userid;
            $scope.newUser.username = userInfo.user_name;
            $scope.newUser.email = userInfo.user_name;
            //$scope.newUser.roleid = showRole(userInfo.role_id);
            //$scope.newUser.roleid = userInfo.role_id;            
            $scope.updateUserInfo.userid = $scope.newUser.userid;
            $scope.updateUserInfo.user_name = $scope.newUser.username;            
            $scope.updateUserInfo.email = $scope.newUser.email;
            $scope.updateUserInfo.role_id = $scope.roles.id;
        };

        $scope.updateUser = function () {
            alert($scope.updateUserInfo.role_id);
            if ($scope.updateUserInfo.role_id == '') { notificationService.displayError('please provide data to required fields'); }
            else {
                apiService.post('api/account/UpdateUser', $scope.updateUserInfo, UpdateUserComplete, UpdateUSerFailed);
            }            
        }
        function UpdateUserComplete() {
            $scope.showRegister = true;
            $scope.showEdit = true;
            $scope.showUpdate = false;
            notificationService.displaySuccess('User updated successfully.');
            BindUsersGrid();
        }

        function UpdateUSerFailed() {
            notificationService.displayError('User Update Failed !');
        }


        
    }

})(angular.module('common.core'));