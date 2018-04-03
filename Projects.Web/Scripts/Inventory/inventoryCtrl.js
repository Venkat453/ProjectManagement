(function (app) {
    'use strict';

    app.controller('inventoryCtrl', inventoryCtrl);

    inventoryCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function inventoryCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();

    }

})(angular.module('common.core'));