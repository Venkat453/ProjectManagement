(function (app) {
    'use strict';

    app.controller('ReferenceMasterCtrl', ReferenceMasterCtrl);

    ReferenceMasterCtrl.$inject = ['$scope', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter'];


    function ReferenceMasterCtrl($scope, $rootScope, apiService, notificationService, $modal, $filter) {

        $rootScope.Loadsaveuserlog();
        $scope.saveUser = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/MasterData/UpdateRefMaster', data, ReferenceMasterUpdateComplete, ReferenceMasterUpdateFailed);

        };

        function ReferenceMasterUpdateComplete() {
            notificationService.displaySuccess('Reference Master updated successfully.');
        }

        function ReferenceMasterUpdateFailed() {
            notificationService.displayError('Reference Master Update Failed !');
        }

        $scope.removeReferenceMaster = function (index) {
            $scope.RefmasterData.splice(index, 1);
        };

        $scope.addReferenceMaster = function () {
            $scope.inserted = {
                id: null,
                groupid: '',
                reference_item: null,
                reference_value: null,
                description: null
            };
            $scope.RefmasterData.push($scope.inserted);
        };

        $scope.groupid = '0';
        LoadMaster();
        
        function LoadMaster() {
            BindReferenceGroup();
            BindReferenceMasterGrid($scope.groupid);
        }
        $scope.RefmasterData = {};
        
        $scope.BindReferenceMasterGrid = BindReferenceMasterGrid;
        function BindReferenceMasterGrid(groupid) {
            if (groupid == null || groupid == undefined || groupid == '')
            {
                groupid = '0';
            }
            apiService.get('api/MasterData/GetReferenceMasterData/' + groupid, null, ReferenceMasterDataLoadComplete, ReferenceMasterDataLoadFailed);
        }

        function ReferenceMasterDataLoadComplete(response) {
            $scope.RefmasterData = response.data;

            $scope.totalItems = $scope.RefmasterData.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 10;

            $scope.paginate = function (value) {
                var begin, end, index;
                begin = ($scope.currentPage - 1) * $scope.numPerPage;
                end = begin + $scope.numPerPage;
                index = $scope.RefmasterData.indexOf(value);
                return (begin <= index && index < end);
            };
        }

        function ReferenceMasterDataLoadFailed(response) {
            notificationService.displayError('Reference Master data could not be loaded.');
        }

        function BindReferenceGroup() {
            apiService.get('api/MasterData/GetReferenceGroup', null, ReferenceGroupLoadComplete, ReferenceGroupLoadFailed);
        }

        function ReferenceGroupLoadComplete(response) {
            $scope.RefgroupmasterData = response.data;
        }

        function ReferenceGroupLoadFailed(response) {
            notificationService.displayError('Reference Group could not be loaded.');
        }

    }
})(angular.module('common.core'));