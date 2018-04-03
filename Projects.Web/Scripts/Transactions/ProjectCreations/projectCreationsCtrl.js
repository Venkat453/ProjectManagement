(function (app) {
    'use strict';
    app.controller('projectCreationsCtrl', projectCreationsCtrl);
    projectCreationsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$route'];
    function projectCreationsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $route) {

        $scope.ProjectMasterList = [];
        $scope.showGrid = true;
        $scope.showform = true;

        $scope.showform = function () {
            $scope.showGrid = false;
            $scope.showform = false;
        };
        $scope.hideForm = function () {
            $route.reload();
            $scope.showGrid = true;
            $scope.showform = true;
        };


        //$scope.OnchangeButton = function () {
        //    var modalInstance = $modal.open({
        //        templateUrl: 'Scripts/Landing/passwordVerification.html',
        //        controller: 'passwordVerificationCtrl',
        //        scope: $scope,
        //    });
        //};

        LoadProjectMasterList();
        function LoadProjectMasterList() {
            apiService.get('api/ProjectMaster/GetProjectMasterList', null, projectMasterLoadComplete, projectMasterLoadFailed);
        };
        function projectMasterLoadComplete(response) {
            $scope.projectMasterList = response.data;
        }

        function projectMasterLoadFailed(response) {
            notificationService.displayError("Unable to Get Project Master Data");
        }


    }
})(angular.module('common.core'));