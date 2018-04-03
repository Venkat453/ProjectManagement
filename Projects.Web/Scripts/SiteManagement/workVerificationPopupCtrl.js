(function (app) {
    'use strict';

    app.controller('workVerificationPopupCtrl', workVerificationPopupCtrl);

    workVerificationPopupCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modalInstance', 'wvdata'];

    function workVerificationPopupCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modalInstance, wvdata) {

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        $scope.wvdata = wvdata;
        $scope.workVerification = {};
        $scope.ok = '';
        $scope.notcompletion = '';
        $scope.RefMasterData = $rootScope.ReferenceMasterData;

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

        $scope.updateWorkVerification = function (wvdata) {   
            $scope.workVerification.id = wvdata.id;
            $scope.workVerification.verification_status = $scope.status;
            $scope.workVerification.nc_quantity = $scope.nc_quantity;
            $scope.workVerification.comments = $scope.comments;
            if (wvdata.completed != null){
                if (wvdata.total == wvdata.completed) {
                    if ($scope.status == 57) {
                        if ($scope.workprogressForm.$valid) {
                            apiService.post('api/Workverification/UpdateWorkVerification', $scope.workVerification, updateWorkVerificationSucceess, updateWorkVerificationFailed);
                        }
                        else {
                            notificationService.displayError("please enter mandatory details...");
                        }
                    }
                    else
                    {
                        apiService.post('api/Workverification/UpdateWorkVerification', $scope.workVerification, updateWorkVerificationSucceess, updateWorkVerificationFailed);
                    }
                }
                else {
                    notificationService.displayError('Assigned Work is not Completed yet...!');
                }
            }
        };
        function updateWorkVerificationSucceess() {
            closeclientmodal();
            notificationService.displaySuccess('Work Verification details updated successfully');
        }
        function updateWorkVerificationFailed() {
            notificationService.displayError('unable to update Work Verification details');
        }

        $scope.getJCName = function (jc_id) {
            for (var j = 0; j < $scope.JunctionsList.length; j++) {
                if ($scope.JunctionsList[j].j_id == jc_id) {
                    return $scope.JunctionsList[j].junction_name;
                }
            }
        };

        $scope.checkncQuantity = function (ncquantity) {
            if (ncquantity > wvdata.total) {
                notificationService.displayError("Non Confirmity work is must be lessthan or equal to Total work...!");
                document.getElementById('nc').value = "";
                document.getElementById("nc").focus();
            }
        };
    }



})(angular.module('common.core'));