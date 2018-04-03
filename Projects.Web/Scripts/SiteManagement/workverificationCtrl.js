(function (app) {
    'use strict';
    app.filter('startFrom', function () {
        return function (input, start) {
            return input.slice(start);
        };
    });
    app.controller('workverificationCtrl', workverificationCtrl);

    workverificationCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modal'];

    function workverificationCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modal) {

        $rootScope.Loadsaveuserlog();
        $scope.PolicestationList = [];
        $scope.WorkverificationList = [];
        $scope.WorkAssignedList = [];
        $scope.SubContractorsList = [];
        $scope.ComponentsList = [];
        $scope.RefMasterData = $rootScope.ReferenceMasterData;
        $scope.showdiv = false;

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

        $scope.showDetails = function (junction) {
            if ($scope.active != junction) {
                $scope.active = junction;
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
            notificationService.displayError('fetching policestations list failed');
        }

      //  $scope.GetAllJunctions = function (project_id) {
        GetAllJunctionsList();
        function GetAllJunctionsList() {
            apiService.get('api/Junction/getJunctionsList/' + $rootScope.tenant.tenant_id, null, GetAllJunctionsListComplete, GetAllJunctionsListFailed);
            $scope.showdiv = true;
        };
        function GetAllJunctionsListComplete(response) {
            $scope.JunctionsList = response.data;
        }
        function GetAllJunctionsListFailed() {
            notificationService.displayError('Fetching GetAllJucntions Failed');
            $scope.showdiv = false;
        }

        GetJunctionsList();
        function GetJunctionsList() {
            apiService.get('api/Junction/getJunctionsCompList', null, JunctionsCompListLoadComplete, JunctionsCompListLoadFailed);
        }
        function JunctionsCompListLoadComplete(response) {
            $scope.JunctionsCompList = response.data;
        }
        function JunctionsCompListLoadFailed() {
            notificationService.displayError('fetching junctionsComponents list failed');
        }
        GetComponentsList();
        function GetComponentsList() {
            apiService.get('api/ProjectComponents/getComponentsList/' + $rootScope.tenant.tenant_id, null, GetComponentsListComplete, GetComponentsListFailed);
        }
        function GetComponentsListComplete(response) {
            $scope.ComponentsList = response.data;
        }
        function GetComponentsListFailed() {
            notificationService.displayError('fetching components List failed');
        }

        GetWorkVerificationList();
        function GetWorkVerificationList() {
            apiService.get('api/Workverification/GetWorkVerification', null, GetWorkVerificationListLoadComplete, GetWorkVerificationListLoadFailed);
        }
        function GetWorkVerificationListLoadComplete(response) {
            $scope.WorkverificationList = response.data;
            for (var i = 0; i < $scope.WorkverificationList.length; i++) {
                $scope.WorkverificationList[i].pending = $scope.WorkverificationList[i].total - $scope.WorkverificationList[i].completed;
                for (var j = 0; j < $scope.ComponentsList.length; j++) {
                    if ($scope.WorkverificationList[i].jun_component == $scope.ComponentsList[j].component) {
                        $scope.WorkverificationList[i].uom = $scope.ComponentsList[j].uom;
                    }
                }
            }
        }
        function GetWorkVerificationListLoadFailed() {
            notificationService.displayError('fetching Work Verification list failed');
        }
        $scope.getstatus = function (id) {
            for (var i = 0; i < $scope.RefMasterData.length; i++) {
                if ($scope.RefMasterData[i].id == id) {
                    return $scope.RefMasterData[i].reference_value;
                }
            }
        };
        //$scope.WorkprogressHistory = function (junctionid) {

        //    var modalInstance = $modal.open({
        //        templateUrl: 'Scripts/SiteManagement/workprogresshistory.html',
        //        controller: 'workprogresshistoryCtrl',
        //        scope: $scope,
        //        resolve: {
        //            junctionid: function () { return junctionid }
        //        }
        //    });
        //};
        $scope.UpdateWorkVerification = function (wvdata) {

            var modalInstance = $modal.open({
                templateUrl: 'Scripts/SiteManagement/workVerificationPopup.html',
                controller: 'workVerificationPopupCtrl',
                scope: $scope,
                resolve: {
                    wvdata: function () { return wvdata }
                }
            });
            modalInstance.result.then(function () {
                GetWorkVerificationList();
            })
        };

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
                    return $scope.SubContractorsList[i].subcontractor_name;
                }

            }
        };
        //$scope.getuom = function (jn_Component) {
        //    for (var i = 0; i < $scope.SubContractorsList.length; i++) {
        //        if ($scope.SubContractorsList[i].id == sc_id) {
        //            return $scope.SubContractorsList[i].subcontractor_name;
        //        }

        //    }
        //};

    }

})(angular.module('common.core'));