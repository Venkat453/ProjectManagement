(function (app) {
    'use strict';

    app.controller('updateJunctionToScCtrl', updateJunctionToScCtrl);

    updateJunctionToScCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'updateJnId', 'jnAssign'];

    function updateJunctionToScCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, updateJnId, jnAssign) {

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        $scope.jnAssign = jnAssign;
       // $scope.assign = assign;
        $scope.updateJnId = updateJnId;
        $scope.workAssign = {};
        $scope.SubContractorsList = [];
        $scope.PolicestationList = [];
        
      

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

        GetPoliceStationsList();
        function GetPoliceStationsList() {
            apiService.get('api/PoliceStation/getPoliceStationList', null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
        }
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
        }
        function PoliceStationsListLoadFailed() {
            notificationService.displayError('fetching policestations list failed');
        }
        GetassignedList();
        function GetassignedList() {
            apiService.get('api/WorkAssignment/getassignedList', null, GetassignedListLoadComplete, GetassignedListFailed);
        }
        function GetassignedListLoadComplete(response) {
            $scope.AssignedList = response.data;
        }
        function GetassignedListFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }

        $scope.getPSName1 = function (ps_id) {
            for (var j = 0; j < $scope.PolicestationList.length; j++) {
                if ($scope.PolicestationList[j].id == ps_id) {
                    return $scope.PolicestationList[j].ps_name;
                }
            }
        };
        $scope.AssignedList = [];
        $scope.getSCName = function (jn_id) {
            for (var j = 0; j < $scope.AssignedList.length; j++) {
                for (var i = 0; i <$scope.SubContractorsList.length; i++) {
                        if ($scope.AssignedList[j].junction_id == jn_id) {
                            if ($scope.SubContractorsList[i].id == $scope.AssignedList[j].subcontractor_id)
                                return $scope.SubContractorsList[i].subcontractor_name;
                    }
                }
            }
        };

        $scope.updateWorkAssign = function () {
            $scope.workAssign.id = $scope.updateJnId;
            $scope.workAssign.subcontractor_id = $scope.subcontractor_id;
            $scope.workAssign.assigned_date = $scope.assign_date;
            //alert($scope.workAssign.id + ' --' + $scope.workAssign.subcontractor_id);
            apiService.post('api/WorkAssignment/UpdateWorkAssign', $scope.workAssign, UpdateWorkAssignSucceess, UpdateWorkAssignFailed);
        };
        function UpdateWorkAssignSucceess() {            
            closeclientmodal();
            notificationService.displaySuccess(' Subcontractor Deassiged successfully');
        }
        function UpdateWorkAssignFailed() {
            notificationService.displayError('failed to update');
        }
    }

})(angular.module('common.core'));