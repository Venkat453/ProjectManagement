(function (app) {
    'use strict';

    app.controller('employeemasterCtrl', employeemasterCtrl);

    employeemasterCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function employeemasterCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.SCList = $rootScope.SCMasterList;


        $scope.showEMForm = false;
        $scope.showAddform = function () {
            if ($scope.showEMForm == false)
            { $scope.showEMForm = true; }
            else { $scope.showEMForm = false; }
        };



    }
})(angular.module('common.core'));