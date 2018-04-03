(function (app) {
    'use strict';

    app.controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modal', '$mdDialog', '$filter'];

    function dashboardCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modal, $mdDialog, $filter) {

        $rootScope.Loadsaveuserlog();
        $scope.chartdetails = [];
        $scope.SCList = [];
        $scope.SCList = $rootScope.SCMasterList;
        $scope.showWPChart = false;
        $scope.showIndChart = false;
        $scope.chartorder = {};
        $scope.chartorderlist = [];
        $scope.subcontracorsNamesList = [];
        $scope.ScWiseTotalEmployesList = [];
        $scope.InductionDoneListList = [];
        $scope.notDoneList = [];
        $scope.doneList = [];
        $scope.order = '';
        $scope.chartpasslist = [];
        $scope.arrValuesForOrder = [];
        $scope.Chartorderlist = [];
        $scope.charttitle = [];
        $scope.Charttitlelist = [];

        $scope.validateRequired = function (value) {
            if (!value)
                return "Title is Required!";
        };
        $scope.editCall = function (rowform) {
            if ($(".checkVisible").is(":visible")) {
                rowform.$cancel();
            }
            else {
                rowform.$show();
            }
        };
         
        $scope.charttitlelist = [
            { 'chart_id': 1, 'is_active': false, 'charts_title': 'Junctions Wise Work Progress Chart' },
            { 'chart_id': 2, 'is_active': false, 'charts_title': 'Induction Done Chart' },
            { 'chart_id': 3, 'is_active': false, 'charts_title': 'Work Progress Quality Chart' },
            { 'chart_id': 4, 'is_active': false, 'charts_title': 'Subcontractor Wise Materials Details Chart' },
            { 'chart_id': 5, 'is_active': false, 'charts_title': 'Medical & Eye Test Done Chart of Labours' },
            { 'chart_id': 6, 'is_active': false, 'charts_title': 'Expires List' }
        ];

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $scope.modalInstance1.close();
        }; 
        $scope.mystyle = { 'background-color': 'rgb(45, 93, 140)', 'border-radius': '9px', 'padding': '1px' };

        LoadChartTitleList();
        function LoadChartTitleList() {
            apiService.get('api/ChartTitle/GetChartTitlelist/' + $rootScope.tenant.user_id, null, GetChartTitleListLoadComplete, GetChartTitleListLoadFailed);
        }
        function GetChartTitleListLoadComplete(response) {
            $scope.Charttitlelist = response.data;
            $scope.charttitle = [];
            for (var i = 0; i < $scope.Charttitlelist.length; i++)
            {
                if ($scope.Charttitlelist[i].is_active == true)
                {
                    $scope.charttitle.push($scope.Charttitlelist[i]);
                }
            }

            if ($scope.Charttitlelist.length == 0)
            {
                $scope.addCharttitle();
            };
            $scope.title1 = $scope.Charttitlelist[0];
            $scope.title2 = $scope.Charttitlelist[1];
            $scope.title3 = $scope.Charttitlelist[2];
            $scope.title4 = $scope.Charttitlelist[3];
            $scope.title5 = $scope.Charttitlelist[4];
            $scope.title6 = $scope.Charttitlelist[5];
        }
        function GetChartTitleListLoadFailed() {
            notificationService.displayError('Fetching ChartOrderList Failed');
        }

        $scope.Updatestatus = function (data, title) {
            $scope.dashboardstatuslist = {
                'id': title.id,
                'userid': $rootScope.tenant.user_id,
                'user_name': $rootScope.tenant.username,
                'chart_id': title.chart_id,
                'is_active': title.is_active,
                'charts_title': data.dashboardstatus
            }
            apiService.post('api/ChartTitle/UpdateChartTitle', $scope.dashboardstatuslist, updatedashboardComplete, updatedashboardFailed);
        };
        function updatedashboardComplete() {
            notificationService.displaySuccess("Title Updated Successfully!");
        }
        function updatedashboardFailed() {
            notificationService.displayError("Title is not updated!");
        }

        GetWorkProgressList();
        function GetWorkProgressList() {
            apiService.get('api/Workprogress/getworkprogress', null, GetWorkProgressListLoadComplete, GetWorkProgressListLoadFailed);
        }
        function GetWorkProgressListLoadComplete(response) {
            $scope.Workprogresspopuplist = response.data;
        }
        function GetWorkProgressListLoadFailed() {
            notificationService.displayError('fetching junctions list failed');
        }

        $scope.Updatedashboard = function () {
            if ($scope.charttitle.length == 0) {
                $scope.charttitle.push({
                    'id': 0,
                    'userid': $rootScope.tenant.user_id,
                    'user_name': $rootScope.tenant.username,
                    'chart_id': 0,
                    'is_active': true,
                    'charts_title': "Empty Data"
                });
            }
            //$scope.dashboardchecklist = {
            //    'id': chartdetails.id,
            //    'userid': $rootScope.tenant.user_id,
            //    'user_name': $rootScope.tenant.username,
            //    'chart_id': chartdetails.chart_id,
            //    'is_active': chartdetails.is_active,
            //    'charts_title': chartdetails.charts_title
            //} 

            apiService.post('api/ChartTitle/UpdateChartTitleList', $scope.charttitle, updatechecklistComplete, updatechecklistFailed);
        };
        function updatechecklistComplete(response) {
            //notificationService.displaySuccess(" Dashboard Updated Successfully !");
            LoadChartTitleList();
        }
        function updatechecklistFailed() {
            //notificationService.displayError("Dashboard not updated !");
        }

        $scope.addCharttitle = function () {
            $scope.charttitleorder = {
                'userid': $rootScope.tenant.user_id,
                'user_name': $rootScope.tenant.username,
                'charttitlelist': $scope.charttitlelist
            };
            apiService.post('api/ChartTitle/SaveChartTitle', $scope.charttitleorder, savechartlistSucceess, savechartlistFailed);
            function savechartlistSucceess() {
                notificationService.displaySuccess('Default Order Saved Successfully');
                LoadChartTitleList();
            }
            function savechartlistFailed() {
                notificationService.displayError('Default Order Saved Failed');
            }
        };

        LoadChartOrderList();
        function LoadChartOrderList() {
            apiService.get('api/Dashboard/GetChartOrderList/' + $rootScope.tenant.user_id, null, GetChartOrderListLoadComplete, GetChartOrderListLoadFailed);
        }
        function GetChartOrderListLoadComplete(response) {
            $scope.Chartorderlist = response.data[0];
            if ($scope.Chartorderlist == null) {
                $scope.addChartorder();
            }
            else {
                $scope.chartlist = $scope.Chartorderlist.charts_order;
                $scope.list = $scope.chartlist.split(',').map(Number);
                $scope.arrValuesForOrder = $scope.list; 
                $scope.ul = $("#sortable");
                $scope.items = $("#sortable li");

                for (var i = $scope.arrValuesForOrder[$scope.arrValuesForOrder.length - 1]; i >= 0; i--) {
                    $scope.ul.prepend($scope.items.get($scope.arrValuesForOrder[i] - 1)); 
                };
            }
        }
        function GetChartOrderListLoadFailed() {
            notificationService.displayError('Fetching ChartOrderList Failed');
        }

        $scope.showPayumoneyOrderform = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/PayuMoney/orderForm.html',
                controller: 'orderFormCtrl',
                scope: $scope,
                resolve: {}
            });
        };

        $(function () {
            $("#sortable").sortable(
                {
                    update: function () {
                        $scope.order = $('#sortable').sortable('toArray').toString();
                        $scope.updateChartorder();
                    },
                    handle: ".panel-heading",
                }).disableSelection();
        });

        $scope.addChartorder = function () {
            $scope.chartorder = {
                'userid': $rootScope.tenant.user_id,
                'user_name': $rootScope.tenant.username,
                'charts_order': $scope.order
            };
            apiService.post('api/Dashboard/SaveChartOrder', $scope.chartorder, savechartorderSucceess, savechartorderFailed);
            function savechartorderSucceess() {
                //notificationService.displaySuccess('Order Saved Succefully');
            }
            function savechartorderFailed() {
                //notificationService.displayError('Order Saved Failed');
            }
        };

        $scope.updateChartorder = function () {
            $scope.chartorder = {
                'userid': $rootScope.tenant.user_id,
                'user_name': $rootScope.tenant.username,
                'charts_order': $scope.order
            };
            apiService.post('api/Dashboard/UpdateChartOrderList', $scope.chartorder, updatechartorderSucceess, updatechartorderFailed);
            function updatechartorderSucceess() {
                // notificationService.displaySuccess('Order update Succefully');
            }
            function updatechartorderFailed() {
                //notificationService.displayError('Order update Failed');
            }
        };

        function MasterLoad(fid) {
            apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + fid + '/' + 0, null, WorkProgressListComplete, WorkProgressListFailed);
            apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + fid, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
            apiService.get('api/Dashboard/ScWiseTotalEmployesList/' + fid, null, ScWiseTotalEmployesListComplete, ScWiseTotalEmployesListFailed);
            apiService.get('api/Dashboard/IndentsStatusList/' + fid, null, IndentsStatusListComplete, IndentsStatusListFailed);
            apiService.get('api/Dashboard/LabourTestCertificates/' + fid, null, LabourTestCertificatesListComplete, LabourTestCertificatesListFailed);
            apiService.get('api/Dashboard/SubContractorWiseIndentcost/' + fid, null, IndentCostListComplete, IndentCostListFailed);
            apiService.get('api/Dashboard/WorkProgressVerifList/' + fid, null, WorkProgressVerifListComplete, WorkProgressVerifListFailed);
            apiService.get('api/Dashboard/SCwithTotalIndentCost/' + fid, null, SCwithTotalIndentCostComplete, SCwithTotalIndentCostFailed);
            apiService.get('api/Dashboard/SCTotalMaterials/' + fid, null, SCTotalMaterialsComplete, SCTotalMaterialsFailed);
        }


        LoadMaster();
        function LoadMaster() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
            //apiService.get('api/Dashboard/ScWiseTotalEmployesList', null, ScWiseTotalEmployesListComplete, ScWiseTotalEmployesListFailed);
            //apiService.get('api/Dashboard/InductionDoneList', null, InductionDoneListComplete, InductionDoneListFailed);

        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
            $scope.fid = $scope.projectslists[0].id;
            $scope.project_id = $scope.fid;
            MasterLoad($scope.fid);
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }

        function SubContractorsListLoadComplete(response) {
            $scope.SCList = response.data;

            for (var i = 0; i < $scope.SCList.length; i++) {
                //for (var j = 0; j < $scope.ScWiseTotalEmployesList.length; j++) {
                //    if ($scope.SCList[i].id == $scope.ScWiseTotalEmployesList[j].subcontractor_id) {
                var scname = '';
                scname = $scope.SCList[i].subcontractor_name
                $scope.subcontracorsNamesList.push(scname);
                GetInductionsChrt();
                //}
                //}
            }

            for (var j = 0; j < $scope.LabourSubcontractorsList.length; j++) {
                for (var i = 0; i < $scope.SCList.length; i++) {
                    if ($scope.SCList[i].id == $scope.LabourSubcontractorsList[j]) {
                        $scope.LabourSubcontractorsList[j] = $scope.SCList[i].subcontractor_name;
                        break;
                    }
                }
            }
            GetLaborCertificatesCountChart();
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('fetching subcontractorslist failed');

        }

        function ScWiseTotalEmployesListComplete(response) {
            $scope.ScWiseTotalEmployesList = response.data;
            //$scope.project_id = fid;
            apiService.get('api/Dashboard/InductionDoneList/' + $scope.project_id, null, InductionDoneListComplete, InductionDoneListFailed);
            //$scope.notDoneList = [];
            //for (var i = 0; i < $scope.ScWiseTotalEmployesList.length; i++) {
            //    var ndone = $scope.ScWiseTotalEmployesList[i].Total;
            //    $scope.notDoneList.push(ndone);
            //    GetInductionsChrt();
            //}
        }
        function ScWiseTotalEmployesListFailed() {
            notificationService.displayError('fetching InductionDone list failed');
        }
        function InductionDoneListComplete(response) {
            $scope.InductionDoneListList = response.data;
            $scope.doneList = [];

            for (var i = 0; i < $scope.InductionDoneListList.length; i++) {
                var done = $scope.InductionDoneListList[i].Total;
                $scope.doneList.push(done);
                GetInductionsChrt();
            }
            $scope.notDoneList = [];
            var flag1 = 0;
            for (var i = 0; i < $scope.ScWiseTotalEmployesList.length; i++) {
                var count = 0;
                for (var j = 0; j < $scope.InductionDoneListList.length; j++) {
                    if ($scope.ScWiseTotalEmployesList[i].Key == $scope.InductionDoneListList[j].Key) {
                        var ndone = $scope.ScWiseTotalEmployesList[i].Total - $scope.InductionDoneListList[j].Total;
                        $scope.notDoneList.push(ndone);
                        flag1++;
                    }
                    if (flag1 == $scope.InductionDoneListList.length) {
                        count++;
                    }
                    //else if ($scope.ScWiseTotalEmployesList[i].Total != 0) {
                    //    var ndone = $scope.ScWiseTotalEmployesList[i].Total;
                    //    $scope.notDoneList.push(ndone);
                    //}
                }
                if (flag1 == $scope.InductionDoneListList.length && count > 1) {
                    var ndone = $scope.ScWiseTotalEmployesList[i].Total;
                    $scope.notDoneList.push(ndone);
                }

            }
            //for (var i = 0; i < $scope.ScWiseTotalEmployesList.length; i++) {
            //    for (var j = 0; j < $scope.InductionDoneListList.length; j++) {
            //        $scope.notDoneList[i, j] = $scope.ScWiseTotalEmployesList[i, j].Total - $scope.InductionDoneListList[i, j].Total;
            //        // $scope.notDoneList.push(ndone);
            //    }
            //}
            GetInductionsChrt();
            if ($scope.InductionDoneListList.length == 0) { $scope.showIndChart = false; } else { $scope.showIndChart = true; }
        }
        function InductionDoneListFailed() {
            notificationService.displayError('fetching InductionDone list failed');

        }


        $scope.getChartDataByProjId = function (project_id) {
            apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + $scope.project_id + '/' + 0, null, WorkProgressListComplete, WorkProgressListFailed);
            apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + $scope.project_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
            apiService.get('api/Dashboard/ScWiseTotalEmployesList/' + $scope.project_id, null, ScWiseTotalEmployesListComplete, ScWiseTotalEmployesListFailed);
            apiService.get('api/Dashboard/IndentsStatusList/' + $scope.project_id, null, IndentsStatusListComplete, IndentsStatusListFailed);
            apiService.get('api/Dashboard/LabourTestCertificates/' + $scope.project_id, null, LabourTestCertificatesListComplete, LabourTestCertificatesListFailed);
            apiService.get('api/Dashboard/SubContractorWiseIndentcost/' + $scope.project_id, null, IndentCostListComplete, IndentCostListFailed);
            apiService.get('api/Dashboard/WorkProgressVerifList/' + $scope.project_id, null, WorkProgressVerifListComplete, WorkProgressVerifListFailed);
            apiService.get('api/Dashboard/SCwithTotalIndentCost/' + $scope.project_id, null, SCwithTotalIndentCostComplete, SCwithTotalIndentCostFailed);
            apiService.get('api/Dashboard/SCTotalMaterials/' + $scope.project_id, null, SCTotalMaterialsComplete, SCTotalMaterialsFailed);
        };

        $scope.psWiseWP = function (ps_id) {
            if (ps_id == null) { ps_id = 0; }
            apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + $scope.project_id + '/' + ps_id, null, WorkProgressListComplete, WorkProgressListFailed);

        };
        $scope.junctions = [];
        $scope.workprogressPercnt = [];
        GetJunctionsWorkProgress();
        function GetJunctionsWorkProgress() {
            //apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + $scope.project_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
            //apiService.get('api/Dashboard/JunctionWiseWorkProgress/' + $scope.project_id + '/' + 0, null, WorkProgressListComplete, WorkProgressListFailed);
        }
        function PoliceStationsListLoadComplete(response) {
            $scope.PolicestationList = response.data;
        }
        function PoliceStationsListLoadFailed() {
            //notificationService.displayError('fetching policestations list failed');
        }
        function WorkProgressListComplete(response) {
            $scope.WorkProgressList = response.data;
            $scope.junctions = [];
            $scope.workprogressPercnt = [];

            for (var i = 0; i < $scope.WorkProgressList.length; i++) {
                $scope.junctions.push($scope.WorkProgressList[i].junction_name);
                var tot = $scope.WorkProgressList[i].totalwork;
                var comp = $scope.WorkProgressList[i].completedwork;
                var wpPercentage = (comp / tot) * 100;
                $scope.workprogressPercnt.push(wpPercentage);
                GetWorkProgressChart();
            }
            if ($scope.WorkProgressList.length == 0) { $scope.showWPChart = false; }
            else { $scope.showWPChart = true; }
        }
        function WorkProgressListFailed() {
            notificationService.displayError('fetching workprogress list failed');

        }

        $scope.Subcontractorname = [];
        $scope.IndentCost = [];
        GetSubContractorIndentCost();
        function GetSubContractorIndentCost() {
            //apiService.get('api/Dashboard/SubContractorWiseIndentcost', null, IndentCostListComplete, IndentCostListFailed);
        }
        function IndentCostListComplete(response) {
            $scope.IndentCostList = response.data;
        }
        function IndentCostListFailed() {
            notificationService.displayError('fetching IndentCost list failed');

        }

        GetIndentStatusList();
        function GetIndentStatusList() {
            //apiService.get('api/Dashboard/IndentsStatusList', null, IndentsStatusListComplete, IndentsStatusListFailed);
        };
        function IndentsStatusListComplete(response) {
            $scope.IndentsStatusList = response.data;
            $scope.indentstatuses = [];
            var approvedCount = 0, rejectedCount = 0, pendingCount = 0, createdCount = 0, givenCount = 0;
            for (var i = 0; i < $scope.IndentsStatusList.length; i++) {
                if ($scope.IndentsStatusList[i].indentstatus == 'Approved') { approvedCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Pending') { pendingCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Rejected') { rejectedCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Created') { createdCount++; }
                else if ($scope.IndentsStatusList[i].indentstatus == 'Given') { givenCount++; }

            }

            $scope.indentstatuses = [['Approved', approvedCount], ['Pending', pendingCount], ['Rejected', rejectedCount], ['Created', createdCount], ['Given', givenCount]];
            if ($scope.IndentsStatusList.length == 0) { $scope.showIndStatChart = false; } else { $scope.showIndStatChart = true; }
            GetIndentsStatusChart();

        }
        function IndentsStatusListFailed() {
            notificationService.displayError('fetching indents status list failed');

        }
        $scope.LabourTestCertificatesList = [];
        $scope.LabourSubcontractorsList = [];
        $scope.MedicalTestDoneList = [];
        $scope.MedicalTestNotDoneList = [];
        $scope.EyeTestDoneList = [];
        $scope.EyeTestNotDoneList = [];
        $scope.aadhardonelist = [];
        $scope.aadharnotdonelist = [];
        $scope.bankdonelist = [];
        $scope.banknotdonelist = [];
        GetLabourTestCertificates();
        function GetLabourTestCertificates() {
            //apiService.get('api/Dashboard/LabourTestCertificates', null, LabourTestCertificatesListComplete, LabourTestCertificatesListFailed);
        }
        function LabourTestCertificatesListComplete(response) {
            $scope.LabourTestCertificatesList = response.data;
            $scope.LabourSubcontractorsList = [];
            $scope.MedicalTestDoneList = [];
            $scope.MedicalTestNotDoneList = [];
            $scope.EyeTestDoneList = [];
            $scope.EyeTestNotDoneList = [];
            $scope.aadhardonelist = [];
            $scope.aadharnotdonelist = [];
            $scope.bankdonelist = [];
            $scope.banknotdonelist = [];
            for (var i = 0; i < $scope.LabourTestCertificatesList.length; i++) {
                $scope.LabourSubcontractorsList.push($scope.LabourTestCertificatesList[i].sc_name[0]);
                $scope.MedicalTestDoneList.push($scope.LabourTestCertificatesList[i].medicalTestDone);
                $scope.MedicalTestNotDoneList.push($scope.LabourTestCertificatesList[i].medicalTestNotDone);
                $scope.EyeTestDoneList.push($scope.LabourTestCertificatesList[i].eyeTestDone);
                $scope.EyeTestNotDoneList.push($scope.LabourTestCertificatesList[i].eyeTestNotDone);
                $scope.aadhardonelist.push($scope.LabourTestCertificatesList[i].aadhardone);
                $scope.aadharnotdonelist.push($scope.LabourTestCertificatesList[i].aadharnotdone);
                $scope.bankdonelist.push($scope.LabourTestCertificatesList[i].bankdone);
                $scope.banknotdonelist.push($scope.LabourTestCertificatesList[i].banknotdone);
            }

            if ($scope.LabourTestCertificatesList.length == 0) { $scope.showLbCertChart = false; } else { $scope.showLbCertChart = true; }
            GetLaborCertificatesCountChart();
        }
        function LabourTestCertificatesListFailed() {
            notificationService.displayError('fetching LabourTestCertificates list failed');

        }


        $scope.WVJunctionsList = [];
        $scope.WVApproved = [];
        $scope.WVNotconfirmed = [];
        function WorkProgressVerifListComplete(response) {
            $scope.WPVerifList = response.data;
            $scope.WVJunctionsList = [];
            $scope.WVApproved = [];
            $scope.WVNotconfirmed = [];

            for (var i = 0; i < $scope.WPVerifList.length; i++) {
                $scope.WVJunctionsList.push($scope.WPVerifList[i].jn_name);
                $scope.WVApproved.push($scope.WPVerifList[i].approvedWork);
                $scope.WVNotconfirmed.push($scope.WPVerifList[i].NotConfirmedWork);
            }

            if ($scope.WPVerifList.length == 0) { $scope.showWpQualChart = false; } else { $scope.showWpQualChart = true; }
            WorkProgressQualityChart();
        }
        function WorkProgressVerifListFailed() {
            notificationService.displayError('fetching LabourTestCertificates list failed');

        }



        function SCwithTotalIndentCostComplete(response) {
            $scope.SCwithTotalIndentCostList = response.data;
            GetSubcontractorIndentCostChart()
        }
        function SCwithTotalIndentCostFailed() {
            notificationService.displayError('fetching SCwith Total Indents total Cost list failed');
        }
        $scope.SCwiseMaterialDetailsList = [];
        function SCTotalMaterialsComplete(response) {
            $scope.SCwiseMaterialDetailsList = response.data;
            apiService.get('api/Dashboard/SCWiseTotalMaterialsList/' + $scope.project_id, null, ScWisetotalIndentswiseDetailsComplete, ScWisetotalIndentswiseDetailsFailed);
        }
        function SCTotalMaterialsFailed() {
            notificationService.displayError('fetching SC wise Total Materials list failed');
        }

        function ScWisetotalIndentswiseDetailsComplete(response) {
            $scope.SCwiseTotalMaterialList = response.data;
            apiService.get('api/Dashboard/IndentStatusWiseMaterialsList/' + $scope.project_id, null, IndentStatusWiseMaterialsListComplete, IndentStatusWiseMaterialsListFailed);
            if ($scope.SCwiseTotalMaterialList.length == 0) { $scope.showMatrlChart = false; } else { $scope.showMatrlChart = true; }

        }
        function ScWisetotalIndentswiseDetailsFailed() {
            //notificationService.displayError('fetching SCwise Total  Materials list failed');
        }
        function IndentStatusWiseMaterialsListComplete(response) {
            $scope.indentStatusWiseMaterialList = response.data;
            SubcontractorWiseMaterialChart();
        }
        function IndentStatusWiseMaterialsListFailed() {
            //notificationService.displayError('fetching SCwise Total  Materials list failed');
        }
        function GetInductionsChrt() {
            Highcharts.chart('InductionContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                xAxis: {
                    categories: $scope.subcontracorsNamesList
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Employess Induction Done list'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: [{
                    name: 'Done',
                    data: $scope.doneList
                },
                {
                    name: 'Not Done',
                    data: $scope.notDoneList
                }]
            });
        }//end of inductionChart func


        function GetSubcontractorIndentCostChart() {
            $scope.Subcontractorname = [];
            $scope.IndentCost = [];
            for (var i = 0; i < $scope.SCwithTotalIndentCostList.length; i++) {
                $scope.Subcontractorname.push($scope.SCwithTotalIndentCostList[i].sc_name[0]);
                $scope.IndentCost.push($scope.SCwithTotalIndentCostList[i].total_cost);
            }
            if ($scope.SCwithTotalIndentCostList.length == 0) { $scope.showIndCostChart = false; } else { $scope.showIndCostChart = true; }


            Highcharts.chart('SubcontractorIndentCostContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                xAxis: {
                    categories: $scope.Subcontractorname//['Floor mill', 'Laxmi nagar', 'Shaik tea stall', 'Raidurgam', 'Olive hospital']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Subcontractor Material Cost'
                    }
                },
                legend: {
                    reversed: true
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}'
                        }
                    }
                },
                series: [{
                    name: 'Subcontractor',
                    data: $scope.IndentCost//[5, 3, 4, 7, 2]
                }]
            });

        }//end of Subcontractor IndentCost Chart func

        function GetWorkProgressChart() {
            Highcharts.chart('WorkProgressContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                xAxis: {
                    categories: $scope.junctions//['Floor mill', 'Laxmi nagar', 'Shaik tea stall', 'Raidurgam', 'Olive hospital']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Junctions Work Progress'
                    }
                },
                legend: {
                    reversed: true
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },
                series: [{
                    name: 'Work Progress',
                    data: $scope.workprogressPercnt,
                    cursor: 'pointer',
                    events: {
                        click: $scope.WorkprogressHistory = function () {
                            //alert($scope.junctions);
                            $scope.modalInstance1 = $modal.open({
                                templateUrl: 'Scripts/Dashboard/WorkprogressList.html',
                                content: $scope.Workprogresspopuplist,
                                scope: $scope,
                                resolve: {}
                            });
                        }
                    },//[5, 3, 4, 7, 2]
                }]
            });

        }//end of workprogressChart func


        function GetIndentsStatusChart() {
            Highcharts.chart('IndentsStatusContainer', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                subtitle: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        events: {
                            click: $scope.IndentStatusPopup = function () {
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/IndentStatusList.html',
                                    content: $scope.IndentLists,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Delivered amount',
                    data: $scope.indentstatuses
                }]
            });
        };//end IndentsStatusChart func



        function GetLaborCertificatesCountChart() {
            Highcharts.chart('LaborCertificatesContainer', {

                chart: {
                    type: 'column'
                },

                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },

                xAxis: {
                    categories: $scope.LabourSubcontractorsList//['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Number of Employees'
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total : ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },

                series: [{
                    name: 'MedicalTest Done',
                    data: $scope.MedicalTestDoneList,//[5, 3, 4, 7, 2],
                    stack: 'Medical Test',
                    cursor: 'pointer',
                    point: {
                        events: {

                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'MedicalTest Not Done',
                    data: $scope.MedicalTestNotDoneList,//[3, 4, 4, 2, 5],
                    stack: 'Medical Test',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'EyeTest Done',
                    data: $scope.EyeTestDoneList,//[2, 5, 6, 2, 1],
                    stack: 'Eye Test',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'EyeTest Not Done',
                    data: $scope.EyeTestNotDoneList,//[3, 0, 4, 4, 3],
                    stack: 'Eye Test',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'Aadhar Submitted',
                    data: $scope.aadhardonelist,//[5, 3, 4, 7, 2],
                    stack: 'Aadhar',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'Aadhar Not submitted',
                    data: $scope.aadharnotdonelist,//[3, 4, 4, 2, 5],
                    stack: 'Aadhar',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'Bank Submitted',
                    data: $scope.bankdonelist,//[2, 5, 6, 2, 1],
                    stack: 'Bank',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }, {
                    name: 'Bank Not Submitted',
                    data: $scope.banknotdonelist,//[3, 0, 4, 4, 3],
                    stack: 'Bank',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: $scope.LaboursCertificates = function () {
                                $scope.subContractorName = $scope.LabourSubcontractorsList[parseInt(this.x)];
                                $scope.modalInstance1 = $modal.open({
                                    templateUrl: 'Scripts/Dashboard/laboursCertificatesList.html',
                                    content: $scope.labourCertificatesList,
                                    scope: $scope,
                                    resolve: {}
                                });
                            }
                        }
                    }
                }]
            });
        }//end of laboircertificatescount func


        function WorkProgressQualityChart() {
            Highcharts.chart('WorkProgressQualityContainer', {

                chart: {
                    type: 'column'
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                xAxis: {
                    categories: $scope.WVJunctionsList
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Employess Induction Done list'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: [{
                    name: 'Approved',
                    data: $scope.WVApproved
                },
                {
                    name: 'Not Confirmed',
                    data: $scope.WVNotconfirmed
                }]
            });
        }//end of workprogressquality func


        $scope.SCwTIList = [];
        $scope.Original = [];
        $scope.mtrlList = [];
        $scope.ODDData = [];
        function SubcontractorWiseMaterialChart() {
            $scope.SCwTIList = [];
            $scope.mtrlList = [];
            $scope.Original = [];
            for (var i = 0; i < $scope.SCwiseMaterialDetailsList.length; i++) {
                //for Subcontractor wise total given Materials List
                $scope.SCwTIList.push({
                    'name': $scope.SCwiseMaterialDetailsList[i].sc_name[0],
                    'y': $scope.SCwiseMaterialDetailsList[i].total_given_quantity,
                    'drilldown': $scope.SCwiseMaterialDetailsList[i].sc_name[0]
                });
                //for Subcontractor wise total materails and given quantity
                $scope.mtrlList = [];
                $scope.ODDData = [];
                for (var j = 0; j < $scope.SCwiseTotalMaterialList.length; j++) {
                    if ($scope.SCwiseMaterialDetailsList[i].sc_id[0] == $scope.SCwiseTotalMaterialList[j].sc_id) {
                        $scope.mtrlList.push({
                            'name': $scope.SCwiseTotalMaterialList[j].material_name,
                            'y': $scope.SCwiseTotalMaterialList[j].given_quantity,
                            'drilldown': $scope.SCwiseTotalMaterialList[j].material_name
                        });
                        $scope.data123 = [];
                        //$scope.indentStatusWiseMaterialList
                        for (var k = 0; k < $scope.indentStatusWiseMaterialList.length; k++) {
                            for (var l = 0; l < $scope.indentStatusWiseMaterialList[k].indent_no.length; l++) {
                                if ($scope.SCwiseMaterialDetailsList[i].sc_id[0] == $scope.indentStatusWiseMaterialList[k].sc_id) {
                                    if ($scope.SCwiseTotalMaterialList[j].material_name == $scope.indentStatusWiseMaterialList[k].material_name) {
                                        $scope.data123.push({
                                            'name': $scope.indentStatusWiseMaterialList[k].indent_no[l],
                                            'y': $scope.indentStatusWiseMaterialList[k].given_quantity[l]
                                        });
                                    }
                                }
                            }
                        }
                        $scope.ODDData.push({
                            'id': $scope.SCwiseTotalMaterialList[j].material_name,
                            'name': $scope.SCwiseTotalMaterialList[j].material_name,
                            'data': $scope.data123
                        });
                    }
                }
                $scope.Original.push({
                    'id': $scope.SCwiseMaterialDetailsList[i].sc_name[0],
                    'name': $scope.SCwiseMaterialDetailsList[i].sc_name[0],
                    'data': $scope.mtrlList,
                });
                for (var v = 0; v < $scope.ODDData.length; v++) {
                    $scope.Original.push({
                        'id': $scope.ODDData[v].id,
                        'name': $scope.ODDData[v].name,
                        'data': $scope.ODDData[v].data
                    });
                }
            }

            // Create the chart
            Highcharts.chart('SCWiseMaterailchart', {
                chart: { type: 'column' },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                subtitle: { text: 'Click the columns to view Material Details' },
                xAxis: { type: 'category' },
                yAxis: {
                    title: { text: 'Total Materials (Units)' }
                },
                legend: { enabled: false },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },

                credits: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> Units <br/>' //{point.y:.2f}
                },

                series: [{
                    name: 'Subcontractor:', colorByPoint: true,
                    data: $scope.SCwTIList
                }],
                drilldown: {
                    colorByPoint: true,
                    series: $scope.Original, //[[name,id,data[],{name,id,data[]},{name,id,data[]},{name,id,data[]}]
                }

            });
        } //end of SubcontractorWiseMaterialChart func

        ////////grids belongs to validity dates of vehicle///////
        GetVehiclesListt();
        function GetVehiclesListt() {
            apiService.get('api/Vehicle/GetVehiclesList/' + $rootScope.tenant.tenant_id, null, vehicleListLoadComplete, vehicleListLoadFailed);
        }
        function vehicleListLoadComplete(response) {
            $scope.vehicleslists = response.data;

            $scope.ExpiredVehicleList = new Array();
            for (var i = 0; i < $scope.vehicleslists.length; i++) {
                var date1 = new Date().getTime();

                var pollution_validdate = new Date($scope.vehicleslists[i].pollution_validdate).getTime();
                var pollution_daysdiff = Math.ceil((pollution_validdate - date1) / (1000 * 3600 * 24));

                var insurence_validdate = new Date($scope.vehicleslists[i].insurence_validdate).getTime();
                var insurance_daysdiff = Math.ceil((insurence_validdate - date1) / (1000 * 3600 * 24));

                var fitness_validdate = new Date($scope.vehicleslists[i].fitness_validdate).getTime();
                var fitness_daysdiff = Math.ceil((fitness_validdate - date1) / (1000 * 3600 * 24));

                var driver_lic_validdate = new Date($scope.vehicleslists[i].driver_lic_validdate).getTime();
                var dri_lic_daysdiff = Math.ceil((driver_lic_validdate - date1) / (1000 * 3600 * 24));
                //var pollution_diffDays = Math.ceil(pollution_daysdiff / (1000 * 3600 * 24));
                if (pollution_daysdiff <= 30 || insurance_daysdiff <= 30 || fitness_daysdiff <= 30 || dri_lic_daysdiff <= 30) {
                    $scope.ExpiredVehicleList.push({
                        'vehicle_reg_no': $scope.vehicleslists[i].vehicle_reg_no,
                        'pollution_validdate': $scope.vehicleslists[i].pollution_validdate,
                        'insurence_validdate': $scope.vehicleslists[i].insurence_validdate,
                        'fitness_validdate': $scope.vehicleslists[i].fitness_validdate,
                        'driver_lic_validdate': $scope.vehicleslists[i].driver_lic_validdate,
                        'driver_contact_no': $scope.vehicleslists[i].driver_contact_no,
                        'driver_name': $scope.vehicleslists[i].driver_name,
                        'driver_lic_no': $scope.vehicleslists[i].driver_lic_no,
                        'project_id': $scope.vehicleslists[i].project_id,
                        'subcontractor_id': $scope.vehicleslists[i].subcontractor_id,
                        'driver_photo': $scope.vehicleslists[i].driver_photo,
                        'created_date': $scope.vehicleslists[i].created_date
                    });
                }
            }
        }
        function vehicleListLoadFailed() {
            notificationService.displayError('fetching vehiclelist failed');
        }



        ///for background colors////
        $scope.set_color = function (CheckingDate) {
            var present_date = new Date().getTime();
            var validaty_date = new Date(CheckingDate).getTime();
            var date_difference = Math.ceil((validaty_date - present_date) / (1000 * 3600 * 24));
            if (date_difference >= 1 && date_difference <= 15) {
                return { backgroundColor: "#ff9800", color: "white" }
            }
            else if (date_difference <= 0) {
                return { backgroundColor: "#f44336", color: "white" }
            }
        }
        $scope.Vehicleview = function (veh_reg) {
            for (var i = 0; i < $scope.ExpiredVehicleList.length; i++) {
                if ($scope.ExpiredVehicleList[i].vehicle_reg_no == veh_reg) {
                    $scope.expiredVehicleList = $scope.ExpiredVehicleList[i];
                }
            }

        }
        ///for background colors////
        // $scope.ExpiredVehicleList = [];
        ///for getting details on click/////
        $scope.dynamicPopover = {
            content: $scope.expiredVehicleList,
            templateUrl: 'Scripts/Dashboard/vehiclecertificate.html',
            title: 'Vehicle Details'
        };
        ///for getting details on click/////
        /////getting driver image in view///
        $scope.getImageinView = function (data) {
            return 'data:image/jpeg;base64,' + data;
        }
        //getting image /////
        ////getting project name in view////
        $scope.getProjectName = function (project_id) {
            for (var j = 0; j < $scope.projectslists.length; j++) {
                if ($scope.projectslists[j].id == project_id) {
                    return $scope.projectslists[j].project_name;
                }
            }
        };
        /////getting project name in view////

        ////getting subname////
        $scope.getSubName = function (sub_id) {
            for (var j = 0; j < $scope.SCList.length; j++) {
                if ($scope.SCList[j].id == sub_id) {
                    return $scope.SCList[j].subcontractor_name;
                }
            }
        };
        ////getting subname///

        //////grid belogs to validity of vehicle certificates///////

        /////grid belongs to labour age///////
        GetLabourWiseList();
        function GetLabourWiseList() {
            apiService.get('api/Labour/GetLaboursWiseList/' + $rootScope.tenant.tenant_id, null, LoadLabourWiseSucceess, LoadLabourWiseFailed);
        }
        function LoadLabourWiseSucceess(response) {
            $scope.LabourswiseList = response.data;
            $scope.readytoretiredlabourList = new Array();
            for (var i = 0; i < $scope.LabourswiseList.length; i++) {
                var date1 = new Date().getTime();
                var labourage = new Date($scope.LabourswiseList[i].age).getTime();
                var daysdiff = Math.ceil((date1 - labourage) / (1000 * 3600 * 24))
                var original_days = 21900;
                var agecheck = original_days - daysdiff;
                if (agecheck <= 150) {
                    $scope.readytoretiredlabourList.push({
                        'aadhar': $scope.LabourswiseList[i].aadhar,
                        'age': $scope.LabourswiseList[i].age,
                        'bank_account_no': $scope.LabourswiseList[i].bank_account_no,
                        'current_contact_number': $scope.LabourswiseList[i].current_contact_number,
                        'epf_no': $scope.LabourswiseList[i].epf_no,
                        'esi_no': $scope.LabourswiseList[i].esi_no,
                        'fathers_name': $scope.LabourswiseList[i].fathers_name,
                        'labour_photo': $scope.LabourswiseList[i].labour_photo,
                        'master_emp_id': $scope.LabourswiseList[i].master_emp_id,
                        'project_name': $scope.LabourswiseList[i].project_name,
                        'subcontractor_name': $scope.LabourswiseList[i].subcontractor_name,
                        'name': $scope.LabourswiseList[i].name,

                        'emp_code': $scope.LabourswiseList[i].emp_code,
                        'code_seperation': $scope.LabourswiseList[i].code_seperation,
                        'emp_num': $scope.LabourswiseList[i].emp_num

                    });
                }

            }
            $scope.missedcertifiedlabourList = new Array();
            for (var i = 0; i < $scope.LabourswiseList.length; i++) {
                if ($scope.LabourswiseList[i].bank_encode == null || $scope.LabourswiseList[i].aadhar_encode == null || $scope.LabourswiseList[i].eye_certificate_encode == null || $scope.LabourswiseList[i].medical_certificate_encode == null) {
                    $scope.missedcertifiedlabourList.push({
                        'fathers_name': $scope.LabourswiseList[i].fathers_name,
                        'labour_photo': $scope.LabourswiseList[i].labour_photo,
                        'master_emp_id': $scope.LabourswiseList[i].master_emp_id,
                        'project_id': $scope.LabourswiseList[i].project_id,
                        'project_name': $scope.LabourswiseList[i].project_name,
                        'subcontractor_id': $scope.LabourswiseList[i].subcontractor_id,
                        'subcontractor_name': $scope.LabourswiseList[i].subcontractor_name,
                        'name': $scope.LabourswiseList[i].name,
                        'emp_code': $scope.LabourswiseList[i].emp_code,
                        'code_seperation': $scope.LabourswiseList[i].code_seperation,
                        'emp_num': $scope.LabourswiseList[i].emp_num,
                        'aadhar_encode': $scope.LabourswiseList[i].aadhar_encode,
                        'aadhar_filename': $scope.LabourswiseList[i].aadhar_filename,
                        'bank_encode': $scope.LabourswiseList[i].bank_encode,
                        'bank_filename': $scope.LabourswiseList[i].bank_filename,
                        'medical_certificate_encode': $scope.LabourswiseList[i].medical_certificate_encode,
                        'medical_filename': $scope.LabourswiseList[i].medical_filename,
                        'eye_certificate_encode': $scope.LabourswiseList[i].eye_certificate_encode,
                        'eye_certificate_filenmae': $scope.LabourswiseList[i].eye_certificate_filenmae,
                        'current_contact_number': $scope.LabourswiseList[i].current_contact_number,
                        'epf_no': $scope.LabourswiseList[i].epf_no,
                        'esi_no': $scope.LabourswiseList[i].esi_no

                    });
                }
            }

            $scope.labourCertificatesList = new Array();
            for (var i = 0; i < $scope.LabourswiseList.length; i++) {
                $scope.labourCertificatesList.push({
                    'fathers_name': $scope.LabourswiseList[i].fathers_name,
                    'labour_photo': $scope.LabourswiseList[i].labour_photo,
                    'master_emp_id': $scope.LabourswiseList[i].master_emp_id,
                    'project_id': $scope.LabourswiseList[i].project_id,
                    'project_name': $scope.LabourswiseList[i].project_name,
                    'subcontractor_id': $scope.LabourswiseList[i].subcontractor_id,
                    'subcontractor_name': $scope.LabourswiseList[i].subcontractor_name,
                    'name': $scope.LabourswiseList[i].name,
                    'emp_code': $scope.LabourswiseList[i].emp_code,
                    'code_seperation': $scope.LabourswiseList[i].code_seperation,
                    'emp_num': $scope.LabourswiseList[i].emp_num,
                    'aadhar_encode': $scope.LabourswiseList[i].aadhar_encode,
                    'aadhar_filename': $scope.LabourswiseList[i].aadhar_filename,
                    'bank_encode': $scope.LabourswiseList[i].bank_encode,
                    'bank_filename': $scope.LabourswiseList[i].bank_filename,
                    'medical_certificate_encode': $scope.LabourswiseList[i].medical_certificate_encode,
                    'medical_filename': $scope.LabourswiseList[i].medical_filename,
                    'eye_certificate_encode': $scope.LabourswiseList[i].eye_certificate_encode,
                    'eye_certificate_filenmae': $scope.LabourswiseList[i].eye_certificate_filenmae,
                    'current_contact_number': $scope.LabourswiseList[i].current_contact_number,
                    'epf_no': $scope.LabourswiseList[i].epf_no,
                    'esi_no': $scope.LabourswiseList[i].esi_no

                });
            }
        }



        function LoadLabourWiseFailed() {
            notificationService.displayError('fetching Workers Wise list failed');
        }
        /////setting bg color for age////
        $scope.set_bgcolor = function (CheckingDate) {
            var present_date = new Date().getTime();
            var validaty_date = new Date(CheckingDate).getTime();
            var dayscheck = Math.ceil((present_date - validaty_date) / (1000 * 3600 * 24))
            var original_days = 21900;
            var agecheck = original_days - dayscheck;
            if (agecheck >= 1 && agecheck <= 50) {
                return { backgroundColor: "#ff9800", color: "white" }
            }
            else if (agecheck <= 0) {
                return { backgroundColor: "#f44336", color: "white" }
            }
        }
        /////setting bg color for age////
        //////for popup///
        $scope.dynamicPopover = {
            content: $scope.lbragechecklist,
            templateUrl: 'Scripts/Dashboard/labouragecheck.html',
            title: 'Labour Details'
        };
        ///for popup/////
        /////for getting data into popup///

        $scope.labourdata = function (mast_emp_id) {
            for (var i = 0; i < $scope.readytoretiredlabourList.length; i++) {
                if ($scope.readytoretiredlabourList[i].master_emp_id == mast_emp_id) {
                    $scope.lbragechecklist = $scope.readytoretiredlabourList[i];
                }
            }

        }
        ///for getting data into popup////
        /////grid belongs to labour age///////

        //indent popup 
        GetindentList();
        function GetindentList() {
            apiService.get('api/indent/GetIndentStatus/' + $rootScope.tenant.tenant_id, null, IndentListLoadComplete, IndentListLoadFailed);
        };
        function IndentListLoadComplete(response) {
            $scope.IndentLists = response.data;
            for (var i = 0; i < $scope.IndentLists.length; i++) {
                for (var j = 0; j < $scope.SCList.length; j++) {
                    if ($scope.IndentLists[i].SubContractor_id == $scope.SCList[j].id) {
                        $scope.IndentLists[i].Subcontractor_name = $scope.SCList[j].subcontractor_name;
                    }
                }
            }
        };
        function IndentListLoadFailed() {
            notificationService.displayError('fetching Indentlist failed');
        };



    }
})(angular.module('common.core'));