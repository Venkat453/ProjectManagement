(function (app) {
    'use strict';

    app.controller('workprogresshistoryCtrl', workprogresshistoryCtrl);

    workprogresshistoryCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'wplist'];

    function workprogresshistoryCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, wplist) {

        $scope.WorkprogressHistoryList = [];
        $scope.wplist = wplist;
        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        GetWorkAssignList();
        function GetWorkAssignList() {
            apiService.get('api/WorkAssignment/GetAssignList', null, GetWorkAssignListComplete, GetWorkAssignListFailed);
        }
        function GetWorkAssignListComplete(response) {
            $scope.WorkAssignedList = response.data;

        }
        function GetWorkAssignListFailed() {
            notificationService.displayError('Fetching GetAllJucntions Failed');
        }
        GetSubContractorsList();
        function GetSubContractorsList() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Fetching Subcontractorslist Failed');
        }
        GetWorkprogressHistoryList();
        function GetWorkprogressHistoryList() {
            apiService.get('api/WorkprogressHistory/getWorkProgressHistoryList', null, WorkprogresshistoryListLoadComplete, WorkprogresshistoryListLoadFailed);
        }
        function WorkprogresshistoryListLoadComplete(response) {
            $scope.WorkprogressHistoryList = response.data;
        }
        function WorkprogresshistoryListLoadFailed() {
            notificationService.displayError('Fetching WorkprogressHistorylist Failed');
        }

        $scope.getSCName = function (sc_id) {
            for (var j = 0; j < $scope.SubContractorsList.length; j++) {
                if ($scope.SubContractorsList[j].id == sc_id) {
                    return $scope.SubContractorsList[j].subcontractor_name;
                }
            }
        };
    }

})(angular.module('common.core'));