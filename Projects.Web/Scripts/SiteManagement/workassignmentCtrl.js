(function (app) {
    'use strict';

    app.controller('workassignmentCtrl', workassignmentCtrl);

    workassignmentCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modal', '$filter'];

    function workassignmentCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modal, $filter) {


        $rootScope.Loadsaveuserlog();
        $scope.WorkAssignedList = [];
        $scope.updateJnId = '';
        $scope.workassignlogList = [];
        $scope.PolicestationList = [];
        $scope.expanded = true;

        //pagination- no. per page dropdown......
        $scope.page = {};
        $scope.page.levelsArr = [
            { value: "5", label: "Records Per Page" },
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

        $scope.showDetail = function (u) {
            if ($scope.active != u.username) {
                $scope.active = u.username;
            }
            else {
                $scope.active = null;
            }
        };

        GetPoliceStationsList();
        function GetPoliceStationsList() {
            apiService.get('api/PoliceStation/getPoliceStationList/' + $rootScope.tenant.tenant_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
        }
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
        }
        function PoliceStationsListLoadFailed() {
            notificationService.displayError('fetching policestations list failed.....!');
        }
        GetProjectMasterList();
        function GetProjectMasterList() {
            apiService.get('api/indent/GetProjectMasterList/' + $rootScope.tenant.tenant_id, null, GetProjectMasterListLoadComplete, GetProjectMasterListFailed);            
        }
        function GetProjectMasterListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectMasterListFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
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

        //$scope.GetAllJunctions = function (projId) {            
        //    apiService.get('api/WorkAssignment/GetTotalJunctionsList/' + projId, null, GetAllJunctionsListComplete, GetAllJunctionsListFailed);
        //    $scope.showdiv = true;
        //};
        //function GetAllJunctionsListComplete(response) {
        //    $scope.JunctionsList = response.data;

        //}
        //function GetAllJunctionsListFailed() {
        //    notificationService.displayError('Fetching GetAllJucntions Failed');
        //}  

        GetJunctionsList();
        function GetJunctionsList(){
        apiService.get('api/WorkAssignment/GetTotalJunctionsList/' + $rootScope.tenant.tenant_id, null, GetAllJunctionsListComplete, GetAllJunctionsListFailed);
           
        };
        function GetAllJunctionsListComplete(response) {
            $scope.JunctionsList = response.data;

        }
        function GetAllJunctionsListFailed() {
            notificationService.displayError('Fetching GetAllJucntions Failed');
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
            //$scope.showdiv = false;
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

        $scope.getassigneddate = function (jnAssign) {
            for (var j = 0; j < $scope.WorkAssignedList.length; j++) {
                if ($scope.WorkAssignedList[j].junction_id == jnAssign.junction_id) {
                    return $scope.WorkAssignedList[j].assigned_date;
                    
                }
            }
        };

        $scope.getSubcontractor = function (jnAssign) {
            var mySc = '';
            var scName = '';
            for (var i = 0; i < $scope.WorkAssignedList.length; i++) {
                if ($scope.WorkAssignedList[i].junction_id == jnAssign.junction_id)
                {
                    mySc = $scope.WorkAssignedList[i].subcontractor_id;
                    break;
                }
            }
            
            for (var i = 0; i < $scope.SubContractorsList.length; i++)
            {
                if($scope.SubContractorsList[i].id==mySc)
                {
                    scName = $scope.SubContractorsList[i].subcontractor_name;
                }
            }
            return scName;
        };


        $rootScope.currentModel = '';
        $scope.showAssignBtn = function (jun_id) {            
            var avlStatus='';
            for (var i = 0; i < $scope.WorkAssignedList.length; i++) {
                if ($scope.WorkAssignedList[i].junction_id == jun_id)
                {
                    avlStatus='Yes';
                    break;
                }
            }
            if ($rootScope.currentModel == jun_id) { return true; }
            else if (avlStatus == 'Yes') {
                return true;
            }
          
            else { return true; }
        };

        $scope.showDeAssignBtn = function (jun_id) {
            var avlStatus = '';
            for (var i = 0; i < $scope.WorkAssignedList.length; i++) {
                if ($scope.WorkAssignedList[i].junction_id == jun_id) {
                    avlStatus = 'Yes';
                    break;
                }
            }
            if ($rootScope.currentModel == jun_id) { return true; }
            else if (avlStatus == 'Yes') {
                return true;
            }
                
            else { return false; }
        };



        $scope.assignJunction = function (jnAssign) {
            
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/SiteManagement/addJunctionToSc.html',
                controller: 'addJunctionToScCtrl',
                scope: $scope,
                resolve: {
                    jnAssign: function () { return jnAssign },
                    SCList: function () { return $scope.SCList }
                }
            });

            modalInstance.result.then(function () {
                GetWorkAssignList();
            })

        };       
          
        $scope.deassignJunction = function (jnAssign) {

            for (var i = 0; i < $scope.WorkAssignedList.length; i++) {
                if ($scope.WorkAssignedList[i].junction_id == jnAssign.junction_id) {
                    $scope.updateJnId = $scope.WorkAssignedList[i].id;
                    break;
                }
            }

            var modalInstance = $modal.open({
                templateUrl: 'Scripts/SiteManagement/updateJunctionToSc.html',
                controller: 'updateJunctionToScCtrl',
                scope: $scope,
                resolve: {
                    jnAssign: function () { return jnAssign },
                    updateJnId: function () { return $scope.updateJnId }
                }
            });

            modalInstance.result.then(function () {
                GetWorkAssignList();
                GetAllJucntionsList();
            })

        };

        GetWorkassignloghistory();
        function GetWorkassignloghistory() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, workassignlogListLoadComplete, workassignlogListLoadFailed);
        }
        function workassignlogListLoadComplete(response) {
            $scope.workassignlogList = response.data;
        }
        function workassignlogListLoadFailed() {
            notificationService.displayError('Fetching workassignloglist Failed');
        }
        GetWorkassignHistoryList();
        function GetWorkassignHistoryList() {
            apiService.get('api/WorkAssignment/getWorkassignHistoryList', null, WorkassignhistoryListLoadComplete, WorkassignhistoryListLoadFailed);
        }
        function WorkassignhistoryListLoadComplete(response) {
            $scope.WorkassignHistoryList = response.data;

        }
        function WorkassignhistoryListLoadFailed() {
            notificationService.displayError('Fetching WorkassignHistorylist Failed');
        }

        GetWorkassignHistoryList();
        function GetWorkassignHistoryList() {
            apiService.get('api/WorkAssignment/getWorkassignHistoryList', null, WorkassignhistoryListLoadComplete, WorkassignhistoryListLoadFailed);
        }
        function WorkassignhistoryListLoadComplete(response) {
            $scope.WorkassignHistoryList = response.data;
        }
        function WorkassignhistoryListLoadFailed() {
            notificationService.displayError('Fetching WorkassignHistorylist Failed');
        }

        $scope.WorkassignHistory = function (jnAssign) {
            for (var i = 0; i < $scope.WorkassignHistoryList.length; i++) {
                if ($scope.WorkassignHistoryList[i].junction_id == jnAssign.junction_id) {
                    var modalInstance = $modal.open({
                        templateUrl: 'Scripts/SiteManagement/workassignhistory.html',
                        controller: 'workassignhistoryCtrl',
                        scope: $scope,
                        resolve: {
                            jnAssign: function () { return jnAssign }
                        }
                    });
                    break;
                };
            }
           
            }
                   
              
           
            

        //$scope.getdata = function (prjctid) {
        //    for (var i = 0; i < $scope.JunctionsList.length; i++) {
        //        if ($scope.JunctionsList[i].project_id == prjctid) {
        //            return $scope.JunctionsList;
        //            $scope.showgrid = true;
        //        }
        //        else {
        //            $scope.showgrid = false;
        //        }
        //    }
            
        //}
    }

})(angular.module('common.core'));