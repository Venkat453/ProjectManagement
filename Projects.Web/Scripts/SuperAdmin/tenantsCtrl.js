(function (app) {
    app.controller('tenantsCtrl', tenantsCtrl);

    tenantsCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']
    function tenantsCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $rootScope.Loadsaveuserlog();
        $scope.tenants = [];
        var tenantid = $rootScope.tenant.tenant_id;

        LoadMaster();
        function LoadMaster() {
            apiService.get('api/Tenant/GetTenants/', null, GetTenantsComplete, GetTenantsFailed);
            apiService.get('api/account/GetAllUsers/' + tenantid, null, UsersLoadComplete, UsersLoadFailed);
            apiService.get('api/Tenant/GetUsers/', null, UsersLoadComplete1, UsersLoadFailed1);
        }

        function GetTenantsComplete(response) {
            $scope.tenants = response.data;
        }

        function GetTenantsFailed(response) {
            notificationService.displayError("Tenants could not be loaded !");
        }
        function UsersLoadComplete(response) {
            $scope.myUsers = response.data;

        }

        function UsersLoadFailed(response) {
            notificationService.displayError("Users List Retrive failed!!!");
        }
        function UsersLoadComplete1(response) {
            $scope.Users = response.data;
        }

        function UsersLoadFailed1(response) {
            notificationService.displayError(response.data);
        }
        $scope.userid = {};
        $scope.Blockuser = function (u) {
            // alert(u.userid);
            $scope.userid.id = u.id;
            //  alert(u.IsLocked);
            if (u.IsLocked == false) {

                alertify.confirm("Block", "Are you sure to Block... " + '' + u.tenant_name,
                    function () {
                        apiService.post('api/Tenant/Blocktenant/' + u.id, null, BlockuserComplete, BlockuserFailed);

                    },
                    function () { }).set('reverseButtons', false);
            }


            else {
                alertify.confirm("Reset", "Are you sure to Reset... " + '' + u.tenant_name,
                    function () {
                        apiService.post('api/Tenant/Blocktenant/' + u.id, null, ResetuserComplete, ResetuserrFailed);
                    },
                    function () { }).set('reverseButtons', false);
            }
        };
        $scope.Mynewlist = {};
        function BlockuserComplete() {
            $scope.blockid = $scope.userid.id;
            for (var i = 0; i < $scope.Users.length; i++) {
                if ($scope.Users[i].tenant_id == $scope.blockid) {
                    $scope.tenid = $scope.Users[i].tenant_id;

                    apiService.get('api/Tenant/GetMyBlockedTusers/' + $scope.tenid, null, Complete, Failed);

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
            notificationService.displaySuccess('Tenant and Users Blocked successfully.');
            LoadMaster();
        }

        function BlockuserFailed() {
            notificationService.displayError('User Blocked Failed !');
        }


        function Blockuser1Complete(response) {
            //  notificationService.displaySuccess('User Blocked Success !');
            LoadMaster();
        }
        function Blockuser1Failed() {
            notificationService.displayError('User Blocked Failed !');
        }


        function ResetuserComplete() {
            $scope.resetid = $scope.userid.id;
            for (var i = 0; i < $scope.Users.length; i++) {
                if ($scope.Users[i].tenant_id == $scope.resetid) {
                    $scope.tenid = $scope.Users[i].tenant_id;

                    apiService.get('api/Tenant/GetMyBlockedTusers/' + $scope.tenid, null, Complete1, Failed1);

                }

            }

            $scope.Mynewlists1 = [];
            function Complete1(response) {
                $scope.Mynewlist1 = response.data;
                for (var i = 0; i < $scope.Mynewlist1.length; i++) {
                    $scope.Mynewlists1.push({
                        'id': $scope.Mynewlist1[i].id,
                        'tenant_id': $scope.Mynewlist1[i].tenant_id,
                        'userid': $scope.Mynewlist1[i].userid

                    })

                }
                apiService.post('api/account/UnLocktenantusers', $scope.Mynewlists1, resetuser1Complete, resetuser1Failed);
            }
            function Failed1() {
                notificationService.displayError("Failed");
            }
            notificationService.displaySuccess('Tenant and Users UnBlocked successfully.');
            LoadMaster();
        }
        //    notificationService.displaySuccess('User Reset successfully.');


        function ResetuserrFailed() {
            notificationService.displayError('User Reset Failed !');
        }
        function resetuser1Complete() {
            // notificationService.displaySuccess('User Reset success !');
        }
        function resetuser1Failed() {
            notificationService.displayError('User Reset Failed !');
        }

        $scope.showDetails = function (junction) {
             if ($scope.active != junction) {
                $scope.active = junction;
                }
             else {
                   $scope.active = null;
                }
        };

    }
})(angular.module('common.core'));