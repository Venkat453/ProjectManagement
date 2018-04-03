
(function (app) {
    'use strict';

    app.factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId).clone(),
                    ctx = { worksheet: worksheetName, table: table.html() },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    });

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['apiService','$scope', '$location', 'membershipService', '$rootScope','$sessionStorage'];
    function rootCtrl(apiService,$scope, $location, membershipService, $rootScope, $sessionStorage) {

        $scope.userData = {};

        $scope.userData.displayUserInfo = displayUserInfo;
        $scope.logout = logout;


        function displayUserInfo() {
            $scope.userData.isUserLoggedIn = membershipService.isUserLoggedIn();

            if ($scope.userData.isUserLoggedIn) {
                $scope.userid = $rootScope.repository.loggedUser.userid;
            }
        }

        function logout() {
            membershipService.removeCredentials();
            $scope.userData.displayUserInfo();

            $rootScope.tenant = {};
            $rootScope.user = {};
            $rootScope.ReferenceMasterData = {};
            $rootScope.MenuList = {};
            $rootScope.StatesList = {};
            $rootScope.CitiesList = {};
            $rootScope.CountriesList = {};
            $scope.savelog = {};
            $rootScope.Loadsaveuserlog = {};

            $rootScope.SCMasterList = {};
            $rootScope.projectslists = {};
            $sessionStorage.MenuList = {};
            $sessionStorage.CitiesList = {};
            $sessionStorage.StatesList = {};
            $sessionStorage.tenant = {};
            $sessionStorage.ReferenceMasterData = {};
            $sessionStorage.CountriesList = {};

            console.log($rootScope.projectslists);
            $location.path('/');
        }

        $scope.userData.displayUserInfo();
       // $location.path('/');
      
            $rootScope.tenant = $sessionStorage.tenant;
            $rootScope.user = $sessionStorage.user;
            $rootScope.ReferenceMasterData = $sessionStorage.ReferenceMasterData;
            $rootScope.MenuList = $sessionStorage.MenuList;
            $rootScope.StatesList = $sessionStorage.StatesList;
            $rootScope.CitiesList = $sessionStorage.CitiesList;
            $rootScope.CountriesList = $sessionStorage.CountriesList;
            $scope.savelog = {};
            $rootScope.Loadsaveuserlog = function () {
                $scope.savelog.userid = $rootScope.tenant.user_id;
                $scope.savelog.user_name = $rootScope.tenant.username;
                $scope.savelog.reference_url = $location.path();
                $scope.savelog.page_url = $location.absUrl();
                apiService.post('api/Log/SaveLog', $scope.savelog);
                apiService.get('api/MenuAccess/GetMenuForAccess/' + $rootScope.tenant.tenant_id, null, GetMenuForAccessComplete, null);
                apiService.get('api/MenuAccess/GetMenuForAccess/' + $rootScope.tenant.tenant_id, null, GetAllUsersMenuAccessListComplete, null);
               // apiService.get('api/MenuAccess/GetMenuList/' + $rootScope.tenant.user_id, null, GetMenuListComplete, null);
            }
            function GetMenuForAccessComplete(response) {
                $scope.MenuForAccessList = response.data;
            }
            function GetAllUsersMenuAccessListComplete(response) {
                $scope.AllMenuAccessList = response.data;
            }
            
       
    }

})(angular.module('Projects'));
