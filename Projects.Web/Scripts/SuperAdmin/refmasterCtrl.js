(function (app) {
    'use strict';

    app.controller('refmasterCtrl', refmasterCtrl);

    refmasterCtrl.$inject = ['$scope', 'apiService', 'notificationService', '$rootScope', '$location'];

    function refmasterCtrl($scope, apiService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.RefMasterData = [];
        $scope.RefMast = [];

        GetRefMaster();
        function GetRefMaster() {
            apiService.get('api/RefMaster/GetRefMaster', null, RefMasterLoadComplete, RefMasterLoadFailed);
        }

        function RefMasterLoadComplete(response) {
            $scope.RefMast = response.data;
            var refGr = '';
            var j = 0;
            for (var i = 0; i < $scope.RefMast.length; i++) {
                if (refGr != $scope.RefMast[i].refGroup) {
                    $scope.RefMasterData.push({
                        'refGroup': $scope.RefMast[i].refGroup,
                        'RefMaster': [{
                            'groupid': $scope.RefMast[i].group_id,
                            'refGroup': $scope.RefMast[i].refGroup,
                            'refID': $scope.RefMast[i].refID,
                            'refItem': $scope.RefMast[i].refItem,
                            'refValue': $scope.RefMast[i].refValue,
                            'description': $scope.RefMast[i].description
                        }]
                    });
                    refGr = $scope.RefMast[i].refGroup;
                    j = $scope.RefMast[i].group_id - 1;
                }
                else {
                    $scope.RefMasterData[j].RefMaster.push({
                        'groupid': $scope.RefMast[i].group_id,
                        'refGroup': $scope.RefMast[i].refGroup,
                        'refID': $scope.RefMast[i].refID,
                        'refItem': $scope.RefMast[i].refItem,
                        'refValue': $scope.RefMast[i].refValue,
                        'description': $scope.RefMast[i].description
                    });
                }
            }

            $scope.totalItems = $scope.RefMasterData.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 10;

            $scope.paginate = function (value) {
                var begin, end, index;
                begin = ($scope.currentPage - 1) * $scope.numPerPage;
                end = begin + $scope.numPerPage;
                index = $scope.RefMasterData.indexOf(value);
                return (begin <= index && index < end);
            };
        }

        function RefMasterLoadFailed(response) {
            notificationService.displayError("Could not load Reference Master Data!");
        }
    }

})(angular.module('common.core'));