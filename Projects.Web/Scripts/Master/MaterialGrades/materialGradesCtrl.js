(function (app) {
    'use strict';
    app.controller('materialGradesCtrl', materialGradesCtrl);
    materialGradesCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal'];
    function materialGradesCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal) {

        $scope.OnchangeButton = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Landing/passwordVerification.html',
                controller: 'passwordVerificationCtrl',
                scope: $scope,
            });
        };


    }
})(angular.module('common.core'));