(function (app) {
    'use strict';
    app.controller('partListCtrl', partListCtrl);
    partListCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal'];
    function partListCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal) {

        $scope.OnchangeButton = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Landing/passwordVerification.html',
                controller: 'passwordVerificationCtrl',
                scope: $scope,
            });
        };


    }
})(angular.module('common.core'));