(function (app) {
    app.controller('loginlogCtrl', loginlogCtrl);

    loginlogCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']
    function loginlogCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $rootScope.Loadsaveuserlog();
        $scope.LoginLog = [];

        LoadMaster();
        function LoadMaster() {
            apiService.get('api/LoginTrack/GetLoginTrack/', null, LoginTrackComplete, LoginTrackFailed);
        }

        function LoginTrackComplete(response) {
            $scope.LoginLog = response.data;

            $scope.totalItems = $scope.LoginLog.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 10;

            $scope.paginate = function (value) {
                var begin, end, index;
                begin = ($scope.currentPage - 1) * $scope.numPerPage;
                end = begin + $scope.numPerPage;
                index = $scope.LoginLog.indexOf(value);
                return (begin <= index && index < end);
            };
        }

        function LoginTrackFailed(response) {
            notificationService.displayError("Login Log could not be loaded !");
        }
    }
})(angular.module('common.core'));