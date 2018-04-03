(function (app) {
    'use strict';

    app.controller('ratechartCtrl', ratechartCtrl);
    app.directive('numbersOnly', function () {
        return {
            require: 'ngModel', link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return ''
                    var transformedInput = inputValue.replace(/(^0$)|[^0-9.]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    } return transformedInput;
                });
            }
        };
    });

    ratechartCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter'];

    function ratechartCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        var tenantid = $rootScope.tenant.tenant_id;
        $scope.ratechart = {};
        $scope.refmaster = [];
        $scope.add_items = [];
        $scope.refmaster = $rootScope.ReferenceMasterData;
        LoadProjectsList();
        $scope.RatechartList = [];
        $scope.fieldworklists = [];
        $scope.SubContractorsList = [];
        $scope.showdiv = false;
        $scope.componentslists = [];

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

        $scope.addSCRateChart = true;
        $scope.showRateForm = false;
        $scope.showrateform = function () {
            if ($scope.showRateForm == false) {
                $scope.showRateForm = true;
                $scope.addSCRateChart = false;
                $scope.newRateForm.$setPristine();
                $scope.newRateForm.$setUntouched();
            }
            else {
                $scope.showRateForm = false;
                $scope.addSCRateChart = true;
            }

        };

        $scope.editCall = function (rowform) {
            if ($(".checkVisible").is(":visible")) {
                rowform.$cancel();
            }
            else {
                rowform.$show();
            }
        };

        $scope.validateRequired = function (value) {
            if (!value)
                return "Price Required";
        };

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }
        LoadComponentsList();
        function LoadComponentsList() {
            apiService.get('api/RateChart/getRatechartList', null, GetComponentsListLoadComplete, GetComponentsListLoadFailed);
        }
        function GetComponentsListLoadComplete(response) {
            $scope.componentslists = response.data;
        }
        function GetComponentsListLoadFailed() {
            notificationService.displayError('Fetching GetComponentsList Failed');
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

        GetFieldworkList();
        function GetFieldworkList() {
            apiService.get('api/fieldworkprice/GetFieldWorksList/' + $rootScope.tenant.tenant_id, null, LoadFieldworkSucceess, LoadFieldworkFailed);
        }
        function LoadFieldworkSucceess(response) {

            $scope.fieldworklists = response.data;

        }
        function LoadFieldworkFailed() {
            notificationService.displayError('fetching Field works list failed');
        }



        $scope.ratechart = { items: [{}] };

        $scope.addItem = function () {
            $scope.ratechart.items.push([{
                fieldwork_id: '',
                fieldwork_description: '',
                unitofmeasurement: '',
                price: ''
            }]);
        }

        $scope.removeItem = function (m) {
            $scope.ratechart.items.splice($scope.ratechart.items.indexOf(m), 1);
        }
        $scope.ratechartdetails = [];

        $scope.addRateChart = function () {
            $scope.rowItems = $scope.ratechart.items;
            $scope.ratechartlist = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'subcontractor_id': $scope.subcontractor_id,
                'projectid': $scope.projectid,
                'ratechartdetails': $scope.ratechartdetails
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                if ($scope.rowItems[0].fieldwork_id == 'undefined' || $scope.rowItems[0].fieldwork_id == null || $scope.rowItems[0].unitofmeasurement == 'undefined' || $scope.rowItems[0].unitofmeasurement == null || $scope.rowItems[0].price == 'undefined' || $scope.rowItems[0].price == null) {
                    notificationService.displayError('Please enter below details');
                }
                else {
                    $scope.ratechartdetails.push({
                        'fieldwork_id': $scope.rowItems[i].fieldwork_id,
                        'fieldwork_description': $scope.rowItems[i].fieldwork_description,
                        'unitofmeasurement': $scope.rowItems[i].unitofmeasurement,
                        'price': $scope.rowItems[i].price
                    });
                }
            }
            if ($scope.newRateForm.$valid) {
                if ($scope.rowItems[0].fieldwork_id == 'undefined' || $scope.rowItems[0].fieldwork_id == null || $scope.rowItems[0].unitofmeasurement == 'undefined' || $scope.rowItems[0].unitofmeasurement == null || $scope.rowItems[0].price == 'undefined' || $scope.rowItems[0].price == null) {
                    notificationService.displayError('Please enter a component');
                }
                else {
                    apiService.post('api/RateChart/SaveRateChart', $scope.ratechartlist, saveratechartSucceess, saveratechartFailed);
                }

            }
            else {
                notificationService.displayError('Please enter mandatory fields');
            }
        }

        function saveratechartSucceess() {
            notificationService.displaySuccess('Ratechart Details Saved Succefully');
            $scope.ratechart = {};
            $scope.subcontractor_id = '';
            $scope.projectid = '';
            $scope.newRateForm.$setPristine();
            $scope.newRateForm.$setUntouched();
            $scope.ratechart = { items: [{}] };
            $scope.ratechartdetails = [];
            $scope.Ratechartform = false;
            GetFieldworkList();
            $scope.showRateForm = false;
            $scope.addSCRateChart = true;
        }

        function saveratechartFailed() {
            notificationService.displayError('Ratechart Details Saved Failed');
        }
        $scope.descriptionhide = false;

        $scope.checkfieldwork = function (item, index, sub_id, projectid) {
            angular.forEach($scope.fieldworklists, function (p) {
                if (p.id == item.fieldwork_id) {
                    item.fieldwork_description = p.fieldwork_description;
                    $scope.descriptionhide = true;
                }
            })

            var checkfieldworkname = '';
            if ($scope.componentslists.length) {
                for (var i = 0; i < $scope.componentslists.length; i++) {
                    if ($scope.componentslists[i].projectid == projectid && $scope.componentslists[i].subcontractor_id == sub_id && $scope.componentslists[i].fieldwork_id == item.fieldwork_id) {
                        checkfieldworkname = 'isDup';
                        break;
                    }
                }
            }
            var arrayCount = 0;
            if ($scope.ratechart.items.length > 1) {
                for (var i = 0; i < $scope.ratechart.items.length; i++) {
                    if (index != i) {
                        if ($scope.ratechart.items[i].fieldwork_id == item.fieldwork_id) {
                            arrayCount++; 
                        }
                    }
                }
            }
            if (arrayCount > 0 || checkfieldworkname == 'isDup') {
                notificationService.displayError("Fieldwork is already exits!");
                $scope.ratechart.items[index].fieldwork_id = '';
            }
        }

        $scope.clerarData = function () {
            $scope.ratechart = { items: [{}] };
        };

        //$scope.checkfieldwork = function (item, sub_id, projectid) {
        //    var checkfieldworkname = '';
        //    for (var i = 0; i < $scope.RatechartList.length; i++) {
        //        if ($scope.RatechartList[i].projectid == projectid && $scope.RatechartList[i].subcontractor_id == sub_id && $scope.RatechartList[i].fieldwork_id == item.fieldwork_id) {

        //            checkfieldworkname = 'isDup';
        //            break;

        //        }
        //    }
        //    if (checkfieldworkname == 'isDup') {
        //        notificationService.displayError('You are already given this Fieldwork!');
        //        $scope.ratechart = {};
        //        $scope.subcontractor_id = '';
        //        $scope.projectid = '';
        //        $scope.newRateForm.$setPristine();
        //        $scope.newRateForm.$setUntouched();
        //        $scope.ratechart = { items: [{}] };
        //        $scope.ratechartdetails = [];
        //        $scope.newRateForm.$setPristine();
        //        $scope.newRateForm.$setUntouched();
        //    }
        //    else {
        //        angular.forEach($scope.fieldworklists, function (p) {
        //            if (p.id == item.fieldwork_id)
        //            {
        //                item.fieldwork_description = p.fieldwork_description;
        //                $scope.descriptionhide = true;
        //            }
        //        })
        //    }
        //};
        $scope.getSCName = function (sc_id) {
            for (var j = 0; j < $scope.SubContractorsList.length; j++) {
                if ($scope.SubContractorsList[j].id == sc_id) {
                    return $scope.SubContractorsList[j].subcontractor_name;
                }
            }
        };

        $scope.getFieldWorkName = function (fw_id) {
            for (var j = 0; j < $scope.fieldworklists.length; j++) {
                if ($scope.fieldworklists[j].id == fw_id) {
                    return $scope.fieldworklists[j].fieldwork_name;
                }
            }
        };

        $scope.saveUser = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/RateChart/updateratechart', data, UserUpdateComplete, UserUpdateFailed);
        };
        function UserUpdateComplete() {
            notificationService.displaySuccess('ratechart price updated  successfully.');
            GetMaterialList();
        }

        function UserUpdateFailed() {
            notificationService.displayError('ratechart price updated Failed !');
        }


        $scope.getRateChartByProjId = function (project_id) {
            apiService.get('api/RateChart/GetRatechartListByTenant/' + $rootScope.tenant.tenant_id + '/' + project_id, null, LoadRateChartSucceess, LoadRateChartFailed);
            $scope.showdiv = true;
        };
        function LoadRateChartSucceess(response) {
            $scope.RatechartList = response.data;
        }
        function LoadRateChartFailed() {
            notificationService.displayError('fetching Rate Chart list failed');
            $scope.showdiv = false;
        }

        $scope.clearForm = function () {
            $scope.ratechart = {};
            $scope.subcontractor_id = '';
            $scope.projectid = '';
            $scope.newRateForm.$setPristine();
            $scope.newRateForm.$setUntouched();
            $scope.ratechart = { items: [{}] };
            $scope.ratechartdetails = [];
        };

    }

})(angular.module('common.core'));