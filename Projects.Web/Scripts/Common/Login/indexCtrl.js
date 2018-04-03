(function (app) {
    'use strict';
    
    app.controller('indexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$mdDialog'];

    function indexCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $mdDialog) {

        $rootScope.Loadsaveuserlog();
        //$scope.options = [{ name: 'Approved' }, { name: 'Pending' }, { name: 'Rejected' }, { name: 'Created' }];
        $scope.options = ['Approved', 'Pending', 'Rejected', 'Created', 'Given'];

        $scope.IndentLists = '';
        $scope.SCList = $rootScope.SCMasterList;
        $scope.refmasterdata = $rootScope.ReferenceMasterData;
        GetindentList();
        $scope.indent = {};
        $scope.IndentStatusList = [];
        $scope.indentlist = [];
        $scope.indentstatuslist = {};
        $scope.totalItems = 0;
        $scope.showdiv = false;

        $scope.person = {};
        $scope.person.levelsArr = [
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
        $scope.person.levels = $scope.person.levelsArr[0].value;


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

        function GetindentList() {
            apiService.get('api/indent/GetIndentStatus/' + $rootScope.tenant.tenant_id, null, IndentListLoadComplete, IndentListLoadFailed);
        }
        function IndentListLoadComplete(response) {
            $scope.IndentLists = response.data;
            $scope.totalItems = $scope.IndentLists.length;

            for (var i = 0; i < $scope.IndentLists.length; i++) {
                for (var j = 0; j < $scope.SCList.length; j++) {
                    if ($scope.IndentLists[i].SubContractor_id == $scope.SCList[j].id) {
                        $scope.IndentLists[i].Subcontractor_name = $scope.SCList[j].subcontractor_name;
                    }
                }
            }
        }
        function IndentListLoadFailed() {
            notificationService.displayError('fetching Indentlist failed');
        }


        $scope.showConfirm = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Select the Indent Status')
                  //.textContent('All of the banks have agreed to forgive you your debts.')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .cancel('Cancel')
                  .ok('Confirm');

            $mdDialog.show(confirm).then(function () {
                $scope.status = 'Indent Status was selected.';
            }, function () {
                $scope.status = 'Indent Status was not selected.';
            });
        };

        $scope.validateRequired = function (value) {
            if (!value)
                return "Required field";
        };
        $scope.editCall = function (rowform) {
            if ($(".checkVisible").is(":visible")) {
                rowform.$cancel();
            }
            else {
                rowform.$show();
            }
        };

        GetIndentStatusDetails();
        function GetIndentStatusDetails() {
            apiService.get('api/indent/GetIndentStatus/' + $rootScope.tenant.tenant_id, null, IndentStatusListLoadComplete, IndentStatusListLoadFailed);
        }
        function IndentStatusListLoadComplete(response) {
            $scope.IndentStatusList = response.data;
        }
        function IndentStatusListLoadFailed() {
            notificationService.displayError('Fetching indent status list Failed');
        }

        //$scope.indent = {};
        //GetIndentList();
        //function GetIndentList() {
        //    apiService.get('api/indent/GetIndentList', null, GetIndentListLoadComplete, GetIndentListFailed);
        //}
        //function GetIndentListLoadComplete(response) {
        //    $scope.GetIndentList = response.data;
        //}
        //function GetIndentListFailed() {
        //    notificationService.displayError('fetching GetProject MasterList failed');
        //}


        $scope.saveindappr = function (indent) {
            $scope.indentlist = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'SubContractor_id': indent.SubContractor_id,
                'project_id': indent.project_id,
                'indent_no': indent.indent_no,
                'material': indent.description,
                'recieved_by': indent.recieved_by,
                'date_recieved': indent.date_recieved,
                'date_required': indent.date_required,
                'indentstatus': indent.indentstatus
            }
            apiService.post('api/indent/SaveIndentStatus', $scope.indentlist, IndentStatusComplete, IndentStatusFailed);
        };
        function IndentStatusComplete() {
            notificationService.displaySuccess("Indent status saved successfully");
            GetIndentStatusDetails();
            GetIndentList();
        }
        function IndentStatusFailed() {
            notificationService.displayError("Indent status not saved");
        }


        $scope.Updatestatus = function (data, indent) {
            $scope.indentstatuslist = {
                'id': indent.id,
                'indentstatus': data.indentstatus
            }
            apiService.post('api/indent/UpdateIndentStatus', $scope.indentstatuslist, updateindentComplete, updateindentFailed);
        };
        function updateindentComplete() {
            GetIndentStatusDetails();
            notificationService.displaySuccess(" indent status Updated Successfully !");
        }
        function updateindentFailed() {
            notificationService.displayError("indent status not updated !");
        }

        GetNCWorksList();
        function GetNCWorksList() {
            apiService.get('api/NonConfirmityWorks/GetNonConfirmityWorksList/' + $rootScope.tenant.tenant_id, null, NonConfirmityWorksListLoadComplete, NonConfirmityWorksListLoadFailed);
        }
        function NonConfirmityWorksListLoadComplete(response) {
            $scope.NCWorksList = response.data;
        }
        function NonConfirmityWorksListLoadFailed() {
            notificationService.displayError('Fetching NonConfirmity works list Failed');
        }
        $scope.ncworks = {};
        $scope.UpdateNCWorksstatus = function (data, NCWorks) {
            //$scope.ncworks.push({
            //    'id': NCWorks.id,
            //    'tenant_id': NCWorks.tenant_id,
            //    'project_id': NCWorks.project_id,
            //    'ps_id': NCWorks.ps_id,
            //    'junction_id': NCWorks.junction_id,
            //    'subcontractor_id': NCWorks.subcontractor_id,
            //    'junction_component': NCWorks.junction_component,
            //    'total': NCWorks.total,
            //    'completed': NCWorks.completed,
            //    'verification_status': NCWorks.verification_status,
            //    'verified_quantity': NCWorks.verified_quantity,
            //    'nc_quantity': NCWorks.nc_quantity,
            //    'comments': NCWorks.comments,
            //    'created_date': NCWorks.created_date
            //});
            
            $scope.ncworks.id = NCWorks.id;
            $scope.ncworks.tenant_id = NCWorks.tenant_id;
            $scope.ncworks.project_id = NCWorks.project_id;
            $scope.ncworks.ps_id = NCWorks.ps_id;
            $scope.ncworks.junction_id = NCWorks.junction_id;
            $scope.ncworks.subcontractor_id = NCWorks.subcontractor_id;
            $scope.ncworks.work_verification_id = NCWorks.work_verification_id;
            $scope.ncworks.junction_component = NCWorks.junction_component;
            $scope.ncworks.total = NCWorks.total;
            $scope.ncworks.completed = NCWorks.completed;
            $scope.ncworks.verification_status = data.ncstatus;
            //for (var i = 0; i < $scope.refmasterdata.length; i++) {
            //    if ($scope.refmasterdata[i].reference_value ==data.ncstatus){
            //        $scope.ncworks.verification_status = $scope.refmasterdata[i].id;
            //    }
            //}
            $scope.ncworks.verified_quantity = NCWorks.verified_quantity;
            $scope.ncworks.nc_quantity = NCWorks.nc_quantity;
            $scope.ncworks.comments = NCWorks.comments;
            $scope.ncworks.created_date = NCWorks.created_date;
            apiService.post('api/NonConfirmityWorks/UpdateNCWorks', $scope.ncworks, updateNCWorksComplete, updateNCWorksFailed);
        };
        function updateNCWorksComplete() {
            GetNCWorksList();
            notificationService.displaySuccess("NC Work status Updated Successfully...!");
        }
        function updateNCWorksFailed() {
            notificationService.displayError("NC Work status not updated...!");
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
     
        $scope.GetAllIndents = function (projId) {
            apiService.get('api/indent/GetTotalIndentList/' + $rootScope.tenant.tenant_id +'/'+ projId,null, IndentprjctListLoadComplete, IndentprjctListLoadFailed);
        }
        function IndentprjctListLoadComplete(response) {
            $scope.IndentnewLists = response.data;
            $scope.showdiv = true;
        }
        function IndentprjctListLoadFailed() {
            notificationService.displayError('fetching Indentlist failed');
            $scope.showdiv = false;
        }

        $scope.getstatus = function (status_id) {
            for (var i = 0; i < $scope.refmasterdata.length; i++) {
                if ($scope.refmasterdata[i].id == status_id) {
                    return $scope.refmasterdata[i].reference_value;
                }
            }
        }

        $scope.validateRequired = function (value) {
            if (!value)
                return "Required field";
        };

        $scope.editCall = function (indentstatusform) {
            if ($(".checkVisible").is(":visible")) {
                indentstatusform.$cancel();
            }
            else {
                indentstatusform.$show();
            }
        }
        $scope.editncCall = function (ncstatusform) {
            if ($(".checkVisible").is(":visible")) {
                ncstatusform.$cancel();
            }
            else {
                ncstatusform.$show();
            }
        }
        
    }

})(angular.module('common.core'));

