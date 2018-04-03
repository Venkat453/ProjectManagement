(function (app) {
    'use strict';

    app.controller('addJunctionToScCtrl', addJunctionToScCtrl);

    addJunctionToScCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'jnAssign', 'SCList'];

    function addJunctionToScCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, jnAssign, SCList) {

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        $scope.jnAssign = jnAssign;
        $scope.workAssign = {};
        $scope.SubContractorsList = [];
        $scope.AssignedList = [];
        $scope.workunAssign = {};
        $scope.JunctionsList = [];


        GetSubContractorsList();
        function GetSubContractorsList() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
            apiService.get('api/SubContractor/getJNCompWiseSCList/' + $scope.jnAssign.junction_id + '/' + $scope.jnAssign.project_id, null, JNCompWiseSCListLoadComplete, JNCompWiseSCListLoadFailed);

        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Fetching Subcontractorslist Failed');
        }
        function JNCompWiseSCListLoadComplete(response) {
            $scope.JNCompSubContractorsList = response.data;
        }
        function JNCompWiseSCListLoadFailed() {
            notificationService.displayError('Fetching jnwiseSubcontractorslist Failed');
        }


        GetPoliceStationsList();
        function GetPoliceStationsList() {
            apiService.get('api/PoliceStation/getPoliceStationList/' + $rootScope.tenant.tenant_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
        }
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
        }
        function PoliceStationsListLoadFailed() {
            notificationService.displayError('fetching policestations list failed....');
        }

        $scope.getPSName = function (ps_id) {
            for (var j = 0; j < $scope.PolicestationList.length; j++) {
                if ($scope.PolicestationList[j].id == ps_id) {
                    return $scope.PolicestationList[j].ps_name;
                }
            }
        };

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
       
        GetassignedList();
        function GetassignedList() {
            apiService.get('api/WorkAssignment/getassignedList', null, GetProjectMasterListLoadComplete, GetProjectMasterListFailed);
        }
        function GetProjectMasterListLoadComplete(response) {
            $scope.AssignedList = response.data;
        }
        function GetProjectMasterListFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }
       
        //$scope.status = '';
        $scope.saveWorkAssign = function () {
            $scope.workAssign.tenant_id = $rootScope.tenant.tenant_id;
            $scope.workAssign.project_id = $scope.jnAssign.project_id;
            $scope.workAssign.ps_id = $scope.jnAssign.ps_id;
            $scope.workAssign.junction_id = $scope.jnAssign.junction_id;
            $scope.workAssign.isAssigned = true;
            $scope.workAssign.subcontractor_id = $scope.subcontractor_id;
            $scope.status = 'original';
            if ($scope.workassignForm.$valid) {
                if ($scope.AssignedList.length!=null) {
                    for (var i = 0; i < $scope.AssignedList.length; i++) {
                        if ($scope.AssignedList[i].junction_id == $scope.jnAssign.junction_id) {
                            if ($scope.AssignedList[i].subcontractor_id == $scope.subcontractor_id) {
                                notificationService.displayError("Already assigned choose another subcontractor");
                                $scope.status = 'duplicate';
                                $scope.subcontractor_id = '';
                                document.getElementById('subcontractor').focus();
                            }
                        }
                    }
                    if ($scope.status != 'duplicate') {
                        apiService.post('api/WorkAssignment/SaveWorkAssign', $scope.workAssign, SaveWorkAssignSucceess, SaveWorkAssignFailed);
                        $scope.status = 'original';
                    }
                }
                else {
                    apiService.post('api/WorkAssignment/SaveWorkAssign', $scope.workAssign, SaveWorkAssignSucceess, SaveWorkAssignFailed);
                    $scope.status = 'original';
                }
                
            }
            else { notificationService.displayError('Please enter mandatory fields'); }

        //    //  $scope.workAssign.assigned_date = $scope.assign_date;
        //    $scope.status = 'original';
        //    if ($scope.workassignForm.$valid) {
        //        if ($scope.AssignedList.length != 0) {
        //            for (var i = 0; i < $scope.AssignedList.length; i++) {
        //                if ($scope.AssignedList[i].subcontractor_id == $scope.subcontractor_id) {
        //                    $scope.status = 'duplicate';
        //                    notificationService.displayError("subcontractor already assigned select another subcontractor");                           
        //                    break;
        //                }
        //            }
        //            if ($scope.status != 'duplicate') {
        //                apiService.post('api/WorkAssignment/SaveWorkAssign', $scope.workAssign, SaveWorkAssignSucceess, SaveWorkAssignFailed);
        //                $scope.status = 'original';
        //            }
        //        }
        //        else {
        //            apiService.post('api/WorkAssignment/SaveWorkAssign', $scope.workAssign, SaveWorkAssignSucceess, SaveWorkAssignFailed);
        //            $scope.status = 'original';
        //        }
        //    }
        //    else { notificationService.displayError('Please enter mandatory fields'); }
        };
        function SaveWorkAssignSucceess() {

            $rootScope.currentModel = $scope.jnAssign.junction_id;
            for (var i = 0; i < $scope.SubContractorsList.length; i++) {
                for (var j = 0; j < $scope.AssignedList.length; j++) {
                    if ($scope.SubContractorsList[i].id == $scope.AssignedList[j].subcontractor_id) {
                        $scope.AssignedList[j].subcontractorname = $scope.SubContractorsList[i].subcontractor_name;
                    }

                }

            }
            $scope.workassignForm.$setPristine();
            $scope.workassignForm.$setUntouched();
            $scope.subcontractor_id = '';
            //alert($rootScope.currentModel);

            //$rootScope.showDeAssignBtn = true;
            //alert('deasgn true value--' + $rootScope.showDeAssignBtn);

            //closeclientmodal();
            notificationService.displaySuccess('work assign saved success');
            GetassignedList();
        }
        function SaveWorkAssignFailed() {
            notificationService.displayError('unable to save workAssignment');
        }

      

            $scope.Deleteassigning = Deleteassigning;
            function Deleteassigning(assid) {
            //$scope.Deleteassigning = function (assid) {
                //$scope.workunAssign.id = assign.id;
                //$scope.workunAssign.isAssigned = false;
                //$scope.workAssign.subcontractor_id = $scope.subcontractor_id;
                //$scope.workAssign.assigned_date = $scope.assign_date;
                //alert($scope.workAssign.id + ' --' + $scope.workAssign.subcontractor_id);
                apiService.post('api/WorkAssignment/deleteWorkAssign/' + assid,null, UpdateWorkUnAssignSucceess, UpdateWorkUnAssignFailed);
            };

            function UpdateWorkUnAssignSucceess(response) {
                notificationService.displaySuccess("unassigning Successfully !");
                GetassignedList();
               
            }

            function UpdateWorkUnAssignFailed(response) {
                notificationService.displayError("assigning Delete Failed. Please try again !");
                
            }

            
            $scope.getscname = function (scid) {
                for (var i = 0; i < $scope.SubContractorsList.length; i++) {
                    if ($scope.SubContractorsList[i].id == scid) {
                        return $scope.SubContractorsList[i].subcontractor_name;
                    }
                }
            };

            $scope.getjunctionname = function (junid) {
                for (var i = 0; i < $scope.JunctionsList.length; i++) {
                    if ($scope.JunctionsList[i].j_id == junid) {
                        return $scope.JunctionsList[i].junction_name;
                    }
                }
            };

           
        }

})(angular.module('common.core'));