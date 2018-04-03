(function (app) {
    'use strict';
    app.directive('validName', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var clean = val.replace(/[^A-Za-z ]+/g, '');
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });
            }
        };
    });


    app.controller('projectComponentsCtrl', projectComponentsCtrl);

    projectComponentsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function projectComponentsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.refmaster = $rootScope.ReferenceMasterData;
        $scope.ComoponentsList = [];
        $scope.components = {};
        $scope.componentdetails = [];
        $scope.projects = [];
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

        GetComponentsList();
        function GetComponentsList() {
            apiService.get('api/ProjectComponents/getComponentsList/' + $rootScope.tenant.tenant_id, null, GetComponentsListComplete, GetComponentsListFailed);
        }
        function GetComponentsListComplete(response) {
            $scope.ComoponentsList = response.data;
            if ($scope.ComoponentsList.length == 0) {
                $scope.showComponentsForm = true;
                $scope.addprjcmp = false;
                $scope.clearbtn = true;
                $scope.hidebtn = false;
                $scope.addbtn = true;
            }
            else {
                $scope.showComponentsForm = false;
                $scope.addprjcmp = true;
            }
        }
        function GetComponentsListFailed() {
            notificationService.displayError('fetching components List failed');
        }

        $scope.showAddform = function () {
            if ($scope.showComponentsForm == false) {
                $scope.showComponentsForm = true;
                $scope.project_id = '';
                $scope.newComponentsForm.$setPristine();
                $scope.newComponentsForm.$setUntouched();
                $scope.addprjcmp = false;
                $scope.hidebtn = true;
                $scope.clearbtn = false;
                $scope.components = {};
                $scope.addbtn = true;
            }
            else {
                $scope.showComponentsForm = false;
                $scope.addprjcmp = true;
            }
        };


        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.components = {};
            $scope.newComponentsForm.$setPristine();
            $scope.newComponentsForm.$setUntouched();
            $scope.project_id = '';
            $scope.rows = { items: [{}] };
            $scope.componentdetails = [];

        }
        $scope.hideUserForm = function () {
            $scope.showAddform();
            $scope.newComponentsForm.$setPristine();
            $scope.newComponentsForm.$setUntouched();
        }
        ///for clear and cancel buttons///
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
        //$scope.addprjcmp = true;
        //$scope.showComponentsForm = false;
       

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        

        $scope.rows = {
            items: [{

            }]
        };
        $scope.nrows = [];

        $scope.addRow = function () {
            $scope.rows.items.push({

            });
        }
        $scope.removeItem = function (m) {
            $scope.rows.items.splice($scope.rows.items.indexOf(m), 1);
        }
         
        $scope.SaveComponents = function () {
            $scope.rowItems = $scope.rows.items;
            $scope.components = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'project_id': $scope.project_id,
                'componentdetails': $scope.componentdetails,
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                $scope.componentdetails.push({
                    'component': $scope.rowItems[i].component,
                    'description': $scope.rowItems[i].component_description,
                    'uom': $scope.rowItems[i].unitofmeasurement
                });
            }
            if ($scope.components) {
                if ($scope.rowItems[0].component == 'undefined' || $scope.rowItems[0].component == null || $scope.rowItems[0].unitofmeasurement == 'undefined' || $scope.rowItems[0].unitofmeasurement == null) {
                    notificationService.displayError('Please enter component');
                }
                else {
                    apiService.post('api/ProjectComponents/SaveComponents', $scope.components, SaveComponentSucceess, SaveComponentFailed);
                }
            }
        };

        function SaveComponentSucceess(response) {
            GetComponentsList();
            notificationService.displaySuccess('Components saved successfully');
            $scope.rows = { items: [{}] };
            $scope.componentdetails = [];
            $scope.showComponentsForm = false;
            $scope.addprjcmp = true;
        }
        function SaveComponentFailed() {
            notificationService.displayError('unable to save Components');
        }

        $scope.checkComponent = function (rws,index) {
            var arrayCount = 0;
            if ($scope.rows.items.length > 1) {
                for (var i = 0; i < $scope.rows.items.length; i++) {
                    if (index != i) {
                        if ($scope.rows.items[i].component == rws.component) {
                            arrayCount++;
                        }
                    }
                }
            }
            if (arrayCount > 0) {
                notificationService.displayError("Component is already exits!");
                $scope.rows.items[index].component = '';
            }
        };
        
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        $scope.checkcomponent = function (component) { 
         for (var i = 0; i < $scope.ComoponentsList.length; i++) { 
         if ($scope.ComoponentsList[i].component == component) { 
         notificationService.displayError("Already Existed Component..!");
         $scope.rows = { items: [{}] };
         document.getElementById('component').focus(); 
         } 
         } 
        }
    }
})(angular.module('common.core'));