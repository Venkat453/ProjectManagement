(function (app) {
    app.controller('orderFormCtrl', orderFormCtrl);
    orderFormCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']

    function orderFormCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $scope.SendOrderDetails = function () {
            if ($scope.order.checkOrder) {
                apiService.post('api/PayUMoney/SendOrder', $scope.order, Ordersuccess, Orderfail);
            }
            else {
                notificationService.displayError("Please accept the License Agremment..!");
            }
        }
        function Ordersuccess(response) {
            $scope.htmldata = response.data;
            apiService.get('api/PayUMoney/GetHashandTxn', null, HashandTxnsuccess, HashandTxnfail);
        }
        function Orderfail(response) {
            notificationService.displayError("Sending Order failed..!");
        }
        function HashandTxnsuccess(response) {
            $scope.HashandTxn = response.data;
            var array1 = new Array();
            array1 = $scope.HashandTxn.split("|||");
            $scope.hashCode = array1[0];
            $scope.transID = array1[1];
            $scope.key = array1[2];
            $scope.surl = array1[3];
            $scope.furl = array1[4];
            $scope.service_provider = array1[5];
        }
        function HashandTxnfail(response) {
            notificationService.displayError("Generating Hash failed..!");
        }

    }
})(angular.module('common.core'));