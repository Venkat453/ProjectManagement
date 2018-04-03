(function (app) {
    'use strict';
    app.controller('makersCtrl', makersCtrl);
    makersCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal'];
    function makersCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal) {

        $scope.OnchangeButton = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Landing/passwordVerification.html',
                controller: 'passwordVerificationCtrl',
                scope: $scope,
            });
        };


    }
})(angular.module('common.core'));