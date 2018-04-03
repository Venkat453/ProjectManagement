(function (app) {
    'use strict';

    app.controller('inductionCtrl', inductionCtrl);

    inductionCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modal', '$mdDialog'];

    function inductionCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modal,$mdDialog) {

        $rootScope.Loadsaveuserlog();
        $scope.vehicleslists = [];
        $scope.LaboursList = [];
        $scope.labors = [];
        $scope.Refmaster = $rootScope.ReferenceMasterData;
       // $scope.SCList = $rootScope.SCMasterList;
        $scope.indlbrlists = [];
        $scope.EmployeesList = [];
        //pagination- no. per page dropdown......
        $scope.page = {};
        $scope.page.levelsArr = [
            { value: "3", label: "Records Per Page" },
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "30", label: "30" },
            { value: "40", label: "40" },
            { value: "50", label: "50" },
            { value: "60", label: "60" },
            { value: "70", label: "70" },
            { value: "80", label: "80" },
            { value: "90", label: "90" },
            { value: "100", label: "100" },
            { value: "150", label: "150" },
            { value: "200", label: "200" }
        ];
        $scope.page.levels = $scope.page.levelsArr[0].value;
        //end........
        //pagination- no. per page dropdown......
       
        $scope.showDetails = function (subcontractor) {
            if ($scope.active != subcontractor) {
                $scope.active = subcontractor;
            }
            else {
                $scope.active = null;
            }
        };
        GetdriverList();
        function GetdriverList() {
            apiService.get('api/Induction/Inductiondriverlist/' + $rootScope.tenant.tenant_id, null, vehicleListLoadComplete, vehicleListLoadFailed);
        }

        function vehicleListLoadComplete(response) {
            $scope.vehicleslists = response.data;
            for (var i = 0; i < $scope.vehicleslists.length; i++) {
                for (var j = 0; j < $scope.indlbrlists.length; j++) {
                    if ($scope.vehicleslists[i].master_emp_id == $scope.indlbrlists[j].master_emp_id) {
                        $scope.vehicleslists[i].CheckedOnly = true;
                        $scope.vehicleslists[i].IsChecked = true;
                    }
                }
            }
        }
        function vehicleListLoadFailed() {
            notificationService.displayError('fetching vehiclelist failed');
        }
        GetLabourList();
        function GetLabourList() {
            apiService.get('api/Induction/Inductionlabourlist/' + $rootScope.tenant.tenant_id, null, LoadLabourSucceess, LoadLabourFailed);
        }
        function LoadLabourSucceess(response) {
            $scope.LaboursList = response.data;
            for (var i = 0; i < $scope.LaboursList.length; i++) {
                for (var j = 0; j < $scope.indlbrlists.length; j++) {
                    if ($scope.LaboursList[i].master_emp_id == $scope.indlbrlists[j].master_emp_id) {
                        $scope.LaboursList[i].CheckedOnly = true;
                        $scope.LaboursList[i].IsChecked = true;
                    }

                }
            }
        }
        function LoadLabourFailed() {
            notificationService.displayError('fetching Workers list failed');
        }

        GetSubContractorsList();
        function GetSubContractorsList() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
            $scope.SCList = [];
            for (var i = 0; i < $scope.SubContractorsList.length; i++) {
                for (var j = 0; j < $scope.LaboursList.length; j++) {
                    for (var k = 0; k < $scope.vehicleslists.length; k++) {
                        if ($scope.SubContractorsList[i].id == ($scope.LaboursList[j].subcontractor_id || $scope.vehicleslists[k].subcontractor_id)) {
                            $scope.SCList.push({
                                'subcontractor_name': $scope.SubContractorsList[i].subcontractor_name,
                                'id': $scope.SubContractorsList[i].id,
                                'project_id': $scope.SubContractorsList[i].project_id
                            })
                        }
                    }

                }

            }
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Fetching Subcontractorslist Failed');
        }
        LoadProjectsList();
        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }

        LoadEmpDetails();
        function LoadEmpDetails() {
            apiService.get('api/EmployeeMaster/GetEmployees/' + $rootScope.tenant.tenant_id, null, LoadEmpComplete, LoadEmpFailed);
        }

        function LoadEmpComplete(response) {
            $scope.EmployeesList = response.data;
        }
        function LoadEmpFailed(response) {
            notificationService.displayError("Employee loaded failed !");
        }

        GetindlbrList();
        function GetindlbrList() {
            apiService.get('api/Induction/GetindlbrList', null, LoadindentSucceess, LoadindentFailed);
        }
        function LoadindentSucceess(response) {
            $scope.indlbrlists = response.data;

        }
        function LoadindentFailed() {
            notificationService.displayError('getting indlbr failed');
        }
        
       
        
       
        var count = 0;
        $scope.getdata =
        function (labors) {
            for (var i = 0; i < $scope.indlbrlists.length; i++) {
                for (var j = 0; j < $scope.LaboursList.length; j++) {
                    if ($scope.LaboursList[j].master_emp_id == $scope.indlbrlists[i].master_emp_id && $scope.LaboursList[j].master_emp_id == labors.master_emp_id) {
                        count++;
                    }
                }
            }
            if (count == 1) {
                notificationService.displaySuccess("induction done")
            }
            else if (count == 0) {
                var modalInstance = $modal.open({
                    templateUrl: 'Scripts/Induction/Wbilabour.html',
                    controller: 'WbilabourCtrl',
                    scope: $scope,
                    resolve: {
                        labors: function () { return labors },
                    }
                });
            }
            count = 0;

            modalInstance.result.then(function () {
                GetLabourList();
                GetindlbrList();         
            })

        };

        var count = 0;
        $scope.getdriverdata =
        function (vehicle) {
            for (var i = 0; i < $scope.indlbrlists.length; i++) {
                for (var j = 0; j < $scope.vehicleslists.length; j++) {
                    if ($scope.vehicleslists[j].master_emp_id == $scope.indlbrlists[i].master_emp_id && $scope.vehicleslists[j].master_emp_id == vehicle.master_emp_id) {
                        count++;
                    }
                }
            }
            if (count == 1) {
                notificationService.displaySuccess("induction done")
            }
            else if (count == 0) {
                var modalInstance = $modal.open({
                    templateUrl: 'Scripts/Induction/Wbidriver.html',
                    controller: 'WbidriverCtrl',
                    scope: $scope,
                    resolve: {
                        vehicle: function () { return vehicle },
                    }
                });
            }
            count = 0;

            modalInstance.result.then(function () {
                GetdriverList();
                GetindlbrList();
            })
        };
        
        $rootScope.currentModel = '';
        $scope.showwbino = function (mast_id) {
            var avlStatus = '';
            for (var i = 0; i < $scope.indlbrlists.length; i++) {
                if ($scope.indlbrlists[i].master_emp_id == mast_id) {
                    avlStatus = 'Yes';
                    break;
                }
            }
            if ($rootScope.currentModel == mast_id) { return false; }
            else if (avlStatus == 'Yes') {
                return false;
            }
            else { return true; }
        };

        $scope.getWbiNo = function (emp_id) {
            var myWbino = '';
            for (var i = 0; i < $scope.indlbrlists.length; i++) {
                if ($scope.indlbrlists[i].master_emp_id == emp_id) {
                    myWbino = $scope.indlbrlists[i].wbi_no;
                    break;
                }
            }
            return myWbino;
        };
        $rootScope.currentModel1 = '';
        $scope.showdrvrwbino = function (mast_id) {
            var avlStatus1 = '';
            for (var i = 0; i < $scope.indlbrlists.length; i++) {
                if ($scope.indlbrlists[i].master_emp_id == mast_id) {
                    avlStatus1 = 'Yes';
                    break;
                }
            }
            if ($rootScope.currentModel == mast_id) { return false; }
            else if (avlStatus1 == 'Yes') {
                return false;
            }
            else { return true; }
        };

        $scope.getdrvrWbiNo = function (emp_id) {
            var myWbino1 = '';
            for (var i = 0; i < $scope.indlbrlists.length; i++) {
                if ($scope.indlbrlists[i].master_emp_id == emp_id) {
                    myWbino1 = $scope.indlbrlists[i].wbi_no;
                    break;
                }
            }
            return myWbino1;
        };
    }
})(angular.module('common.core'));