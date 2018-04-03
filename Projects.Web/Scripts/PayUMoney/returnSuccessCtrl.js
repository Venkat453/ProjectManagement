(function (app) {
    app.controller('returnSuccessCtrl', returnSuccessCtrl);
    returnSuccessCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']

    function returnSuccessCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        function GetMenuList() {
            apiService.get('api/MenuAccess/GetMenuList/' + $rootScope.tenant.user_id, null, GetMenuListComplete, null);
        }

        function GetMenuListComplete(response) {
            $rootScope.MenuList = response.data;
        }

        //LoadMaster();
        //function LoadMaster() {
        //    apiService.get('api/PayUMoney/GetReturnDetails', null, ReturnDetailssuccess, ReturnDetailsfail);
        //}
        //function ReturnDetailssuccess(response) {
        //    $scope.returnDetails = response.data;
        //}
        //function ReturnDetailsfail(response) {
        //    notificationService.displayError("Getting Return Details failed..!");
        //}

    }
})(angular.module('common.core'));