(function (app) {
    'use strict';

    app.controller('ErrorLogCtrl', ErrorLogCtrl);

    ErrorLogCtrl.$inject = ['$scope', 'apiService', 'notificationService', '$rootScope', '$location'];

    function ErrorLogCtrl($scope, apiService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.ErrorLog = [];


        GetErrorsList();
        function GetErrorsList() {
            apiService.get('api/ErrorLog/GetErrorLog', null, ErrorsLoadComplete, ErrorsLoadFailed);
        }

        function ErrorsLoadComplete(response) {
            $scope.ErrorsList = response.data;
            var tkey = '';
            var j = 0;
            for (var i = 0; i < $scope.ErrorsList.length; i++) {
                if (tkey != $scope.ErrorsList[i].tenant_key) {
                    
                    $scope.ErrorLog.push({
                        'TenantKey': $scope.ErrorsList[i].tenant_key,
                        'errors': [{
                            'TenantKey': $scope.ErrorsList[i].tenant_key,
                            'user': $scope.ErrorsList[i].user_name,
                            'message': $scope.ErrorsList[i].message,
                            'stacktrace': $scope.ErrorsList[i].stacktrace,
                            'date_created': $scope.ErrorsList[i].date_created
                        }]
                    });
                    tkey = $scope.ErrorsList[i].tenant_key;
                    j = i;
                }
                else {
                    $scope.ErrorLog[j].errors.push({
                        'TenantKey': $scope.ErrorsList[i].tenant_key,
                        'user': $scope.ErrorsList[i].user_name,
                        'message': $scope.ErrorsList[i].message,
                        'stacktrace': $scope.ErrorsList[i].stacktrace,
                        'date_created': $scope.ErrorsList[i].date_created
                    });
                }
            }

            $scope.totalItems = $scope.ErrorsList.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 10;

            $scope.paginate = function (value) {
                var begin, end, index;
                begin = ($scope.currentPage - 1) * $scope.numPerPage;
                end = begin + $scope.numPerPage;
                index = $scope.ErrorsList.indexOf(value);
                return (begin <= index && index < end);
            };
        }

        function ErrorsLoadFailed(response) {
            notificationService.displayError(response.data);
        }
    }

})(angular.module('common.core'));