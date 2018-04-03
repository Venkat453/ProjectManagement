(function (app) {
    'use strict';

    app.controller('workassignhistoryCtrl', workassignhistoryCtrl);

    workassignhistoryCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'jnAssign'];

    function workassignhistoryCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, jnAssign) {

        $scope.WorkprogressHistoryList = [];
        $scope.jnAssign = jnAssign;
        $scope.WorkassignHistoryList = [];
        $scope.SubContractorsList = [];
        $scope.JunctionsList = [];

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        //GetWorkAssignList();
        //function GetWorkAssignList() {
        //    apiService.get('api/WorkAssignment/GetAssignList', null, GetWorkAssignListComplete, GetWorkAssignListFailed);
        //}
        //function GetWorkAssignListComplete(response) {
        //    $scope.WorkAssignedList = response.data;

        //}
        //function GetWorkAssignListFailed() {
        //    notificationService.displayError('Fetching GetAllJucntions Failed');
        //}
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
        //GetWorkprogressHistoryList();
        //function GetWorkprogressHistoryList() {
        //    apiService.get('api/WorkprogressHistory/getWorkProgressHistoryList', null, WorkprogresshistoryListLoadComplete, WorkprogresshistoryListLoadFailed);
        //}
        //function WorkprogresshistoryListLoadComplete(response) {
        //    $scope.WorkprogressHistoryList = response.data;
        //}
        //function WorkprogresshistoryListLoadFailed() {
        //    notificationService.displayError('Fetching WorkprogressHistorylist Failed');
        //}

        GetWorkassignHistoryList();
        function GetWorkassignHistoryList() {
            apiService.get('api/WorkAssignment/getWorkassignHistoryList', null, WorkassignhistoryListLoadComplete, WorkassignhistoryListLoadFailed);
        }
        function WorkassignhistoryListLoadComplete(response) {
            $scope.WorkassignHistoryList = response.data;
            //for (var i = 0; i < $scope.SubContractorsList.length; i++) {
            //    for (var j = 0; j <$scope.WorkassignHistoryList.length; j++) {
            //        if ($scope.SubContractorsList[i].id=$scope.WorkassignHistoryList[j].subcontractor_id)  
            //        {
            //            $scope.WorkassignHistoryList[j].subcontractorname = $scope.SubContractorsList[i].subcontractor_name;
            //        }
            //    }

            //}
            //for (var i = 0; i < $scope.SubContractorsList.length; i++) {
            //    for (var j = 0; j < $scope.JunctionsList.length; j++) {
            //        if ($scope.SubContractorsList[i].id = $scope.WorkassignHistoryList[j].junction_id) {
            //            $scope.JunctionsList[j].junctionname = $scope.SubContractorsList[i].junction_name;
            //        }
            //    }

            //}
        }
        function WorkassignhistoryListLoadFailed() {
            notificationService.displayError('Fetching WorkassignHistorylist Failed');
        }

        GetJunctionsList();
        function GetJunctionsList() {
            apiService.get('api/Junction/getJunctionsList/' + $rootScope.tenant.tenant_id, null, JunctionsListLoadComplete, JunctionsListLoadFailed);
         }
        function JunctionsListLoadComplete(response) {
            $scope.JunctionsList = response.data;
          
        }
        function JunctionsListLoadFailed() {
            notificationService.displayError('fetching junctions list failed');
        }
        $scope.getscname = function (scid) {
            for (var j = 0; j < $scope.SubContractorsList.length; j++) {
                if ($scope.SubContractorsList[j].id == scid) {
                    return $scope.SubContractorsList[j].subcontractor_name;

                }
            }
        };

       
    }

})(angular.module('common.core'));