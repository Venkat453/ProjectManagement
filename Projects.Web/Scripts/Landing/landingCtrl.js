(function (app) {
    'use strict';
    app.controller('landingCtrl', landingCtrl);
    landingCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal'];
    function landingCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter,  $modal) {

        $scope.user = {};
        $scope.OnchangeButton = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Landing/passwordVerification.html',
                controller: 'passwordVerificationCtrl',
                scope: $scope,
                resolve: {
                    currentUser: function () { return $rootScope.tenant }
                }
            });
        };


    }
})(angular.module('common.core'));