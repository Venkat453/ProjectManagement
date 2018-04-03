(function (app) {
    'use strict';

    app.controller('usermenuaccessCtrl', usermenuaccessCtrl);

    app.directive('validName', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var clean = val.replace(/[^A-Za-z ]+/g, '');
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });
            }
        };
    });

    app.directive('validNumber', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var clean = val.replace(/[^0-9]+/g, '');
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    });

    app.run(function (editableOptions) {
        editableOptions.theme = 'bs3';
    });
    usermenuaccessCtrl.$inject = ['$scope', '$filter', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function usermenuaccessCtrl($scope, $filter, apiService, membershipService, notificationService, $rootScope, $location) {


        $rootScope.Loadsaveuserlog();
        $scope.MenuList = $rootScope.MenuList;
        $scope.TenantMenuList = $rootScope.MenuList;
        $scope.AllMenuAccessList = [];
        $scope.userMenuAccessList = [];
        $scope.myUsers = [];
        $scope.userid = '';
        $scope.rolesList = [];
        $scope.userAccessList = [];
        $scope.subMenuList = [];
        $scope.toggle = true;
        $scope.newUser = {};
        $scope.newUser.mail2tenant = true;
        $scope.newUser.mail2user = false;
        $scope.editForm = false;
        $scope.currentid = '';
        $scope.friviosid = '';
      

        $scope.pageClass = 'page-login';
        $scope.registerNewUser = registerNewUser;

        $scope.user = {};
        $scope.DeleteUserList = DeleteUserList;

        $scope.showDetails = function (mainmenu) {
            if ($scope.active != mainmenu)
            {
                $scope.active = mainmenu;
            }
            else
            {
                $scope.active = null;
            }
        };


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
        function DeleteUserList(u) {
            membershipService.deleteuser(u.userID, deleteCompleted);
        } 
        BindUsersGrid();
        function BindUsersGrid() {
            apiService.get('api/account/GetMyUsers/' + $rootScope.tenant.tenant_id, null, AllUsersLoadComplete, null);
            apiService.get('api/MenuAccess/GetMenu', null, AllMenuComplete, null);
        }
        function AllUsersLoadComplete(response) {
            $scope.AllUsers = response.data; 

        }
        function AllMenuComplete(response) {
            $rootScope.Allmenu = response.data;
        }
        function registerNewUser() {
            $scope.newUser.tenant_id = $rootScope.tenant.tenant_id;
            $scope.newUser.is_tenant = false;
            $scope.newUser.password = $scope.newUser.pwd;
            $scope.newUser.Roleid = $scope.roles.id;
            $scope.newUser.user_name = $scope.newUser.username;

            if ($scope.newUserForm.$valid) {
                membershipService.register($scope.newUser, registerCompleted) 
            }
            else { notificationService.displayError('Please fill mandatory fields'); }
        }

        function registerCompleted(response) {
            if (response.data == 'Failure sending mail.')
            {
                BindUsersGrid();
                $scope.userRegistration = !$scope.userRegistration;
                notificationService.displaySuccess($scope.newUser.userid + ' is Registered successfully!');
                $scope.newUser = {};
                $scope.roles = '';
                $scope.newUserForm.$setPristine();
                $scope.newUserForm.$setUntouched(); 
            }
            else {
                notificationService.displayError('Registration failed. Try again.');
                BindUsersGrid();
            }
        }
        function registerFailed(response)
        {

        }
        GetUserAccessList();
        function GetUserAccessList() {
            apiService.get('api/MenuAccess/GetMenuForAccess/' + $rootScope.tenant.tenant_id, null, GetMenuForAccessComplete, null);
        }

        function GetMenuForAccessComplete(response) {
            $scope.MenuForAccessList = response.data;
        } 
        $scope.validateRequired = function (value)
        {
            if (!value)
                return "Required field";
        };
        $scope.editCall = function (rowform) {
            if ($(".checkVisible").is(":visible")) {
                rowform.$cancel();
            }
            else {
                rowform.$show();
            }
        };

        $scope.updateUser = function (data, id) {
            angular.extend(data, { id: id }); 
            $scope.user.id = data.id;
            $scope.user.userid = data.user_id;
            $scope.user.user_name = data.mUserName;
            $scope.user.email = data.mEmail;
            $scope.user.Role_id = data.mRole;

            apiService.post('api/account/UpdateUser', $scope.user, UpdateUserComplete, UpdateUSerFailed);

        };

        function UpdateUserComplete() {
            notificationService.displaySuccess('User updated successfully.');
            BindUsersGrid();
        }

        function UpdateUSerFailed() {
            notificationService.displayError('User Update Failed !');
        }

        $scope.showRole = function (roleid) {
            var selected = $filter('filter')($scope.rolesList, { id: roleid });
            return (roleid && selected.length) ? selected[0].Name : 'Not set';
        };

        $scope.LoadUserMenuAccess = function (userid) {
            GetAllUsersMenuAccessList();
            $scope.userMenuAccessList = $filter('filter')($scope.AllMenuAccessList, { userid: userid });
            for (var j = 0; j < $scope.TenantMenuList.length; j++) {
                $scope.TenantMenuList[j].is_access = false;
            }

            for (var i = 0; i < $scope.userMenuAccessList.length; i++) {
                for (var j = 0; j < $scope.TenantMenuList.length; j++) {
                    if ($scope.userMenuAccessList[i].menu_id == $scope.TenantMenuList[j].id) {
                        $scope.TenantMenuList[j].is_access = $scope.userMenuAccessList[i].is_access;
                    }
                }
            }
        }

        $scope.SaveMenuAccess = function () {
            $scope.userAccessList = [];

            for (var i = 0; i < $scope.TenantMenuList.length; i++) {
                if ($scope.TenantMenuList[i].is_access == true) {
                    $scope.userAccessList.push({
                        'user_id': $scope.userSelected.id,
                        'tenant_id': $rootScope.tenant.tenant_id,
                        'menu_id': $scope.TenantMenuList[i].id,
                        'is_active': true
                    });
                }
            }

            apiService.post('api/MenuAccess/SaveMenuAccess', $scope.userAccessList, MenuAccessComplete, MenuAccessFailed);
        }

        function MenuAccessComplete() {
            notificationService.displaySuccess('Access Given successfully.');
        }

        function MenuAccessFailed() {
            notificationService.displayError('Could not save the User Access!');
        }

        $scope.$watch('toggle', function () {
            $scope.toggleText = $scope.toggle ? 'Add New User' : 'Hide User Form';
        })

        $scope.showEmpList = true;
        $scope.showUserRegForm = false;
        GetEmployeesList();
        function GetEmployeesList() {
            apiService.get('api/MenuAccess/GetEmployeesList', null, GetEmployeesListSuccess, GetEmployeesListFailed);
        }

        function GetEmployeesListSuccess(response) {
            $scope.EmployeesList = response.data;
        }
        function GetEmployeesListFailed() {
            notificationService.displayError('Unable to get employees list');
        }

        $scope.CreateUser = function (emp) {
            $scope.showEmpList = false;
            $scope.showUserRegForm = true;
            $scope.newUser.username = emp.UserName;
        };

        $scope.ClearUserForm = function () {
            $scope.newUser = {};
            $scope.roles = '';
            $scope.newUserForm.$setPristine();
            $scope.newUserForm.$setUntouched();
            $scope.userRegistration = !$scope.userRegistration;
            $scope.showEmpList = true;
            $scope.showUserRegForm = false;
        }

        var getAllSelected = function () {  
            var selectedItems = $scope.subMenuList.filter(function (smenu) {
                return smenu.is_access; }); 
            return selectedItems.length === $scope.subMenuList.length; }
        var setAllSelected = function (value,menuid) {
            $scope.subMenuList = ($filter('filter')($scope.TenantMenuList, { parent_menu: menuid }, true));
            angular.forEach($scope.subMenuList, function (smenu) { smenu.is_access = value; });
        }
        $scope.checkAll = function (value, id) {
            if (value !== undefined) {
                var menuid = id; return setAllSelected(value, menuid);
            } else { return getAllSelected(); }
        }

        $scope.userid = {};
        $scope.Blockuser = function (u) { 
            $scope.userid.userid = u.userid; 
            if (u.IsLocked == false) {
                if (u.IsTenant == true) {
                    alertify.confirm("Block", "Are you want to block the user" + ' ' + u.user_name,
                        function () {
                            apiService.post('api/account/LockUser', $scope.userid, BlockuserComplete, BlockuserFailed);
                            apiService.post('api/Tenant/Blocktenant/' + u.tenant_id, null, BlocktenantComple, BlocktenantFailed);

                        },
                        function () { }).set('reverseButtons', false);
                }
                else {

                    alertify.confirm("Block", "Are you want to block the user" + ' ' + u.user_name,
                        function () {
                            apiService.post('api/account/LockUser', $scope.userid, BlockuseComplete, BlockuseFailed);

                        },
                        function () { }).set('reverseButtons', false);
                }
            }
            else {
                if (u.IsTenant == true) {
                    alertify.confirm("Reset", "Are you want to reset the user" + ' ' + u.user_name,
                        function () {
                            apiService.post('api/account/UnlockUser', $scope.userid, ResetuserComplete, ResetuserrFailed);
                            apiService.post('api/Tenant/Blocktenant/' + u.tenant_id, null, BlocktenantComple, BlocktenantFailed);

                        },
                        function () { }).set('reverseButtons', false);
                }
                else {
                    alertify.confirm("Reset", "Are you want to reset the user" + ' ' + u.user_name,
                      function () {
                          apiService.post('api/account/UnlockUser', $scope.userid, Resetuser1Complete, Resetuser1Failed);
                      },
                      function () { }).set('reverseButtons', false);
                }
            }
        };

        function BlockuseComplete() {
            notificationService.displaySuccess('User Blocked successfully.');
            BindUsersGrid();
        }

        function BlockuseFailed() {
            notificationService.displayError('User Blocked Failed !');
        }


        $scope.Mynewlist = {};
        function BlockuserComplete() {

            $scope.blockid = $scope.userid.userid;
            for (var i = 0; i < $scope.myUsers.length; i++) {
                if ($scope.myUsers[i].userid == $scope.blockid) {
                    $scope.tenid = $scope.myUsers[i].tenant_id;

                    apiService.get('api/account/GetMyBlockedTusers/' + $scope.tenid, null, Complete, Failed);

                }

            }

            $scope.Mynewlists = [];
            function Complete(response) {
                $scope.Mynewlist = response.data;
                for (var i = 0; i < $scope.Mynewlist.length; i++) {
                    $scope.Mynewlists.push({
                        'id': $scope.Mynewlist[i].id,
                        'tenant_id': $scope.Mynewlist[i].tenant_id,
                        'userid': $scope.Mynewlist[i].userid

                    })

                }
                apiService.post('api/account/Locktenantusers', $scope.Mynewlists, Blockuser1Complete, Blockuser1Failed);
            }
            function Failed() {
                notificationService.displayError("Failed");
            }

            notificationService.displaySuccess('Tenant & Users Blocked successfully.');
            BindUsersGrid();


            function Blockuser1Complete() {
                //  notificationService.displaySuccess('User Blocked Success !');
                BindUsersGrid();
            }
            function Blockuser1Failed() {
                //notificationService.displayError('User Blocked Failed !');
            }
        }

        function BlockuserFailed() {
            notificationService.displayError('User Blocked Failed !');
        }

        function ResetuserComplete() {
            $scope.unblockid = $scope.userid.userid;
            for (var i = 0; i < $scope.myUsers.length; i++) {
                if ($scope.myUsers[i].userid == $scope.unblockid) {
                    $scope.tenid = $scope.myUsers[i].tenant_id;

                    apiService.get('api/account/GetMyBlockedTusers/' + $scope.tenid, null, Complete, Failed);

                }

            }

            $scope.Mynewlists1 = [];
            function Complete(response) {
                $scope.Mynewlist1 = response.data;
                for (var i = 0; i < $scope.Mynewlist1.length; i++) {
                    $scope.Mynewlists1.push({
                        'id': $scope.Mynewlist1[i].id,
                        'tenant_id': $scope.Mynewlist1[i].tenant_id,
                        'userid': $scope.Mynewlist1[i].userid

                    })

                }
                apiService.post('api/account/UnLocktenantusers', $scope.Mynewlists1, Blockuser2Complete, Blockuser2Failed);
            }
            function Failed() {
                notificationService.displayError("Failed");
            }
            notificationService.displaySuccess('Tenant & Users Unblocked successfully.');
            BindUsersGrid();

        }

        function ResetuserrFailed() {
            notificationService.displayError('User Reset Failed !');
        }
        function Resetuser1Complete() {
            notificationService.displaySuccess("User Unblocked Successfully!...");
            BindUsersGrid();
        }
        function Resetuser1Failed() {
            notificationService.displayError("User Reset Failed1..");

        }

        function BlocktenantComple() {

        }
        function BlocktenantFailed() {
            notificationService.displayError("Failed...");
        }
        function Blockuser2Complete() {
            // notificationService.displaySuccess("success!..");
            BindUsersGrid();
        }
        function Blockuser2Failed() {

        }




        GAUMAList();
        function GAUMAList() { apiService.get('api/MenuAccess/GetMenuForAccess/' + $rootScope.tenant.tenant_id, null, GAUMALComplete, null); }
        function GAUMALComplete(response) { $scope.AllMenuAccessList = response.data; }

        $scope.LoadUserMenuAccess = function (userId) {
            $scope.menuSelected = '';
            $scope.displayGrid = false;
            if (userId == '' || userId == undefined || userId == null) {
                $scope.displayGrid = false;
                return false;
            }
            else {
                $scope.menuSelected = '';
                $scope.displayGrid = false;
                for (var j = 0; j < $scope.Allmenu.length; j++) {
                    $scope.Allmenu[j].is_access = false;
                }
                $scope.userMenuAccessList = $filter('filter')($scope.AllMenuAccessList, { userid: userId });
                for (var i = 0; i < $scope.userMenuAccessList.length; i++) {
                    for (var j = 0; j < $scope.Allmenu.length; j++) {
                        if ($scope.userMenuAccessList[i].menu_id == $scope.Allmenu[j].id) {
                            $scope.Allmenu[j].is_access = $scope.userMenuAccessList[i].is_access;
                            if ($scope.Allmenu[j].is_access == true) {
                                $scope.displayGrid = true;
                            }
                        }
                    }
                }
            }
        }

        $scope.SaveMenuAccess = function () {
            $scope.userAccessList = [];
            for (var i = 0; i < $scope.Allmenu.length; i++) {
                if ($scope.Allmenu[i].is_access == true) {
                    $scope.userAccessList.push({
                        'user_id': $scope.selectedUser.id,
                        'tenant_id': $rootScope.tenant.tenant_id,
                        'menu_id': $scope.Allmenu[i].id,
                        'is_active': true
                    });
                }
            }
            apiService.post('api/MenuAccess/SaveMenuAccess', $scope.userAccessList, MenuAccessComplete, MenuAccessFailed);
        }

        function MenuAccessComplete() {
            notificationService.displaySuccess("Access granted");
            GAUMAList();
        }
        function MenuAccessFailed() {
            notificationService.displayError("Access granting failed");
        }

        $scope.onPushSelectedMenu = function (submenu) {
            if (submenu.is_access == true) {
                $scope.displayGrid = true;
            }
        }

        $scope.filterData = function (data) {
            return data.parent_menu === $scope.menuSelected.id || data.id === $scope.menuSelected.id;
        };

        $scope.loadMenuList = function (selectmenu) {
            $scope.mainmenusel = selectmenu;
            $scope.isChecked = false;
        };

        $scope.CheckAll = function (isAccess, menuid, mainmenuSelected) {
            $scope.subMenuList = ($filter('filter')($scope.Allmenu, { parent_menu: menuid }, true));
            angular.forEach($scope.subMenuList, function (submenu) {
                submenu.is_access = isAccess;
            });
            if ($scope.subMenuList == '') {
                $scope.openedSubmenu = ($filter('filter')($scope.Allmenu, { parent_menu: mainmenuSelected.id }, true));
                if (isAccess == true) {
                    for (var i = 0; i < $scope.openedSubmenu.length; i++) {
                        if ($scope.openedSubmenu[i].is_access == true) {
                            mainmenuSelected.is_access = true;
                            break;
                        }
                    }
                }
                else {
                    for (var i = 0; i < $scope.openedSubmenu.length; i++) {
                        if ($scope.openedSubmenu[i].is_access == false) {
                            mainmenuSelected.is_access = false;
                        }
                        else { mainmenuSelected.is_access = true; break; }
                    }
                }
            }
        }
    }
})(angular.module('common.core'));