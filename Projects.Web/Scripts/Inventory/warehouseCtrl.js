(function (app) {
    'use strict';
    
    app.controller('warehouseCtrl', warehouseCtrl);

    warehouseCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location','$modal'];

    function warehouseCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location,$modal) {

        $rootScope.Loadsaveuserlog();
        $scope.Refmaster = $rootScope.ReferenceMasterData;
       // $scope.SubContractorList = $rootScope.SCMasterList;
       // $scope.totalItems = $scope.SubContractorList.length;
        $scope.IndentStatusList = [];
        $scope.IndentHeaderList = [];
        $scope.IndentDetailsList = [];
        $scope.WarehouseDetailsList = [];
        $scope.projectslists = [];

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
            //for (var i = 0; i < $scope.IndentStatusList.length; i++) {
            //    if ($scope.IndentStatusList[i].SubContractor_id == junction.id) {
            //        if ($scope.IndentStatusList[i].indentstatus =='Approved') {
                        if ($scope.active != junction) {
                            $scope.active = junction;
                        }
                        else {
                            $scope.active = null;
                       }
            //        }

            //    }

            //}

            
        };

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
            $scope.newSubContractorsList = response.data;
            $scope.SubContractorList = [];
            for (var i = 0; i < $scope.newSubContractorList.length; i++) {
                for (var j = 0; j < $scope.IndentStatusList.length; j++) {
                    if ($scope.newSubContractorList[i].id == $scope.IndentStatusList[j].SubContractor_id) {
                        if ($scope.IndentStatusList[j].indentstatus == 'Approved') {
                            $scope.SubContractorList.push({
                                'subcontractor_name': $scope.newSubContractorList[i].subcontractor_name,
                                'id': $scope.newSubContractorList[i].id,
                                'project_id': $scope.newSubContractorList[i].project_id
                            })
                        }
                    }
                }

            }
           
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Fetching Subcontractorslist Failed');
        }
        GetIndentStatusList();
        function GetIndentStatusList() {
            apiService.get('api/indent/GetIndentStatus/' + $rootScope.tenant.tenant_id, null, GetIndentStatusListComplete, GetIndentStatusListFailed);
        }
        function GetIndentStatusListComplete(response) {
            $scope.IndentStatusList = response.data;
        }
        function GetIndentStatusListFailed() {
            notificationService.displayError('Indent Status List Load failed...!');
        }
        GetIndentHeaderList();
        function GetIndentHeaderList() {
            apiService.get('api/indent/GetIndent/' + $rootScope.tenant.tenant_id, null, GetIndentHeaderListComplete, GetIndentHeaderListFailed);
        }
        function GetIndentHeaderListComplete(response) {
            $scope.IndentHeaderList = response.data;
        }
        function GetIndentHeaderListFailed() {
            notificationService.displayError('Indent Header List Load failed...!');
        }
        GetIndentdetailsList();
        function GetIndentdetailsList() {
            apiService.get('api/indent/GetIndentdetails/' + $rootScope.tenant.tenant_id, null, GetIndentdetailsListComplete, GetIndentdetailsListFailed);
        }
        function GetIndentdetailsListComplete(response) {
            $scope.IndentDetailsList = response.data;
        }
        function GetIndentdetailsListFailed() {
            notificationService.displayError('Indent Details List Load failed...!');
        }

        GetWarehousedetailsList();
        function GetWarehousedetailsList() {
            apiService.get('api/indent/WarehouseDetailsList', null, GetWarehousedetailsComplete, GetWarehousedetailsFailed);
        }
        function GetWarehousedetailsComplete(response) {
            $scope.WarehouseDetailsList = response.data;
        }
        function GetWarehousedetailsFailed() {
            notificationService.displayError('Warehouse Details List Load failed...!');
        }



        ///forpopup///
        $rootScope.Count = 0;
        $scope.releasematerialPopUp = releasematerialPopUp;
        function releasematerialPopUp(indentStatus) {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Inventory/warehousePopup.html',
                controller: 'warehousePopupCtrl',
                scope: $scope,
                resolve: {
                    indentNo: function () { return indentStatus.indent_no },
                    created_Date: function () { return indentStatus.date_recieved },
                }
            })
            modalInstance.result.then(function () {
                GetIndentStatusList();
            })
        }
        ///for popup///

    }
})(angular.module('common.core'));
