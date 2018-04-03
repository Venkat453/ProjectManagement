(function (app) {
    'use strict';

    app.controller('updateWorkProgressCtrl', updateWorkProgressCtrl);

    updateWorkProgressCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'wpdata'];

    function updateWorkProgressCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, wpdata) {

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        $scope.wpdata = wpdata;
        $scope.workProgress = {};
        //$scope.subcontractor_id = '';
        $scope.past = new Date();
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
        $scope.updateWorkProgress = function (workprogressData) {
            if ($scope.workprogressForm.$valid)
            {
                var progress = parseInt($scope.progress);
                if (($scope.wpdata.completed + progress) > $scope.wpdata.total)
                {
                    notificationService.displayError('Complete value greater than pending');
                }
                else
                {
                    $scope.workProgress.subcontractor_id = $scope.subcontractor_id;
                    $scope.workProgress.workprogress_id = $scope.wpdata.workprogress_id;
                    $scope.workProgress.progress = $scope.progress;
                    $scope.workProgress.update_date = $scope.update_date;
                    $scope.wpdata.subcontractor_id = $scope.subcontractor_id;
                    $scope.wpdata.tenant_id = $rootScope.tenant.tenant_id;
                    $scope.wpdata.update_date = $scope.update_date;
                    $scope.wpdata.progress = $scope.progress;
                    $scope.wpdata.update_date = $scope.update_date;

                    apiService.post('api/Workprogress/UpdateWorkprogress', $scope.workProgress, updateWorkProgressSucceess, updateWorkProgressFailed);
                    apiService.post('api/WorkprogressHistory/SaveWorkprogressHistory', $scope.wpdata, SaveWorkprogressHistorySucceess, SaveWorkprogressHistoryFailed);
                }
            }
            else {
                notificationService.displayError('Please enter mandatory fields');
            }
        };

        function updateWorkProgressSucceess() {
            closeclientmodal();
            notificationService.displaySuccess('workprogress updated successfully');
        }
        function updateWorkProgressFailed() {
            notificationService.displayError('unable to update workprogress');
        }

        function SaveWorkprogressHistorySucceess() {
            //closeclientmodal();
            //notificationService.displaySuccess('workprogresshistory save successfully');
        }
        function SaveWorkprogressHistoryFailed() {
            notificationService.displayError('workprogresshistory save failed!');
        }

        $scope.getJCName = function (jc_id) {
            for (var j = 0; j < $scope.JunctionsList.length; j++) {
                if ($scope.JunctionsList[j].j_id == jc_id) {
                    return $scope.JunctionsList[j].junction_name;
                }
            }
        };


        GetWorkAssignList();
        function GetWorkAssignList() {
            apiService.get('api/WorkAssignment/GetAssignList', null, GetWorkAssignListComplete, GetWorkAssignListFailed);
        }
        function GetWorkAssignListComplete(response) {
            $scope.WorkAssignedList = response.data;
            for (var i = 0; i < $scope.WorkAssignedList.length; i++) {
                for (var j = 0; j < $scope.SubContractorsList.length; j++) {
                    if ($scope.WorkAssignedList[i].subcontractor_id == $scope.SubContractorsList[j].id) {
                        $scope.WorkAssignedList[i].subcontractor_name = $scope.SubContractorsList[j].subcontractor_name;
                    }
                }
            }
        }
        function GetWorkAssignListFailed() {
            notificationService.displayError('Fetching GetAllJucntions Failed');
        }

        $scope.subname = '';
        $scope.getscname = function (jn_id) {
            var sc_id = '';
            for (var j = 0; j < $scope.WorkAssignedList.length; j++) {
                if ($scope.WorkAssignedList[j].junction_id == jn_id) {
                    sc_id = $scope.WorkAssignedList[j].subcontractor_id;
                    break;
                }
            }

            for (var i = 0; i < $scope.SubContractorsList.length; i++) {
                if ($scope.SubContractorsList[i].id == sc_id) {
                    $scope.subname = $scope.SubContractorsList[i].subcontractor_name;
                    return $scope.SubContractorsList[i].subcontractor_name;
                }

            }
        };
        $scope.WPSCCompList = [];
        $scope.WorkPrgsdata = {};
        GetWPSCCompList();
        function GetWPSCCompList() {
            $scope.WorkPrgsdata.junction_id = wpdata.junction_id;
            $scope.WorkPrgsdata.junction_component = wpdata.junction_component;

            apiService.post('api/WorkAssignment/getWPJNCompWiseSCList', $scope.WorkPrgsdata, GetWPSCCompListComplete, GetWPSCCompListFailed);
        }
        function GetWPSCCompListComplete(response) {
            $scope.WPSCCompList = response.data;
        }
        function GetWPSCCompListFailed() {
            notificationService.displayError('Work Progress wise Subcontractor Component  list Feteching failed');
        }

    }
})(angular.module('common.core'));