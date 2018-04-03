(function (app) {
    'use strict';

    app.filter('startFrom', function () {
        return function (input, start) {
            return input.slice(start);
        };
    });

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
                    } return clean;
                });
            }
        };
    });
    app.directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined
                    if (inputValue == undefined) return ''
                    var transformedInput = inputValue.replace(/[^0-9.]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });

    app.controller('junctionsCtrl', junctionsCtrl);

    junctionsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function junctionsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $scope.tenantid = $rootScope.tenant.tenant_id;
        $scope.junComponents = [];
        $scope.junction = {};
        $scope.PolicestationList = [];
        $scope.JunctionsList = [];
        $scope.ComponentsList = [];
        $rootScope.Loadsaveuserlog();
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
        LoadComponentsList();
        function LoadComponentsList() {
            apiService.get('api/ProjectComponents/getComponentsList/' + $rootScope.tenant.tenant_id, null, GetComponentsListComplete, GetComponentsListFailed);
        }
        function GetComponentsListComplete(response) {
            $scope.ComponentsList = response.data;
        }
        function GetComponentsListFailed() {
            notificationService.displayError('fetching components List failed');
        }


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

        GetJunctionsList();
        function GetJunctionsList() {
            apiService.get('api/Junction/getJunctionsList/' + $rootScope.tenant.tenant_id, null, JunctionsListLoadComplete, JunctionsListLoadFailed);
            apiService.get('api/Junction/getJunctionsCompList', null, JunctionsCompListLoadComplete, JunctionsCompListLoadFailed);
        }
        function JunctionsListLoadComplete(response) {
            $scope.JunctionsList = response.data;
            if ($scope.JunctionsList.length == 0) {
                $scope.showJNForm = true;
                $scope.addjun = false;
                $scope.clearbtn = true;
                $scope.addBtn = true;
                $scope.hidebtn = false;
                $scope.updateBtn = false;
            }
            else {
                $scope.showJNForm = false;
                $scope.addBtn = true;
                $scope.clearbtn = false;
                $scope.hidebtn = true;
                $scope.updateBtn = false;
                $scope.addjun = true;
            }
            // $scope.totalItems = $scope.JunctionsList.length;
        }
        function JunctionsListLoadFailed() {
            notificationService.displayError('fetching junctions list failed');
        }
        function JunctionsCompListLoadComplete(response) {
            $scope.JunctionsCompList = response.data;
            for (var i = 0; i < $scope.JunctionsCompList.length; i++) {
                for (var j = 0; j < $scope.ComponentsList.length; j++) {
                    if ($scope.JunctionsCompList[i].component == $scope.ComponentsList[j].component) {
                        $scope.JunctionsCompList[i].uom = $scope.ComponentsList[j].uom;
                    }
                }
            }
        }
        function JunctionsCompListLoadFailed() {
            notificationService.displayError('fetching junctionsComponents list failed');
        }

        $scope.showDetails = function (junction) {
            if ($scope.active != junction) {
                $scope.active = junction;
            }
            else {
                $scope.active = null;
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
                return "Required field";
        };

        $scope.showAddform = function () {
            if ($scope.showJNForm == false) {
                $scope.showJNForm = true;
                $scope.addjun = false;
                $scope.hidebtn = true;
                $scope.addBtn = true;
                $scope.clearbtn = false;
                $scope.updateBtn = false;
                $scope.newJunctionForm.$setPristine();
                $scope.newJunctionForm.$setUntouched();
                $scope.junction = {};
            }
            else {
                $scope.showJNForm = false;
                $scope.addjun = true;
            }
        };


        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.junction = {};
            $scope.newJunctionForm.$setPristine();
            $scope.newJunctionForm.$setUntouched();
            $scope.junction.project_id = '';
            $scope.junction.ps = '';
            $scope.rows = { items: [{}] };
            $scope.junComponents = [];

        }
        $scope.hideUserForm = function () {
            $scope.showAddform();
            $scope.newJunctionForm.$setPristine();
            $scope.newJunctionForm.$setUntouched();
        }
        ///for clear and cancel buttons///
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



        $scope.addJunction = function () {

            $scope.rowItems = $scope.rows.items;
            $scope.junction = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'project_id': $scope.junction.project_id,
                'ps_id': $scope.junction.ps,
                'junction_name': $scope.junction.junction_name,
                'created_by': $rootScope.tenant.tenant_id,
                'modified_by': $rootScope.tenant.tenant_id,
                'junComponents': $scope.junComponents
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                if ($scope.rowItems[0].component == 'undefined' || $scope.rowItems[0].component == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null) {
                    notificationService.displayError("please enter the component");
                }
                else {


                    $scope.junComponents.push({
                        'component': $scope.rowItems[i].component,
                        'quantity': $scope.rowItems[i].quantity
                    });
                }
            }

            if ($scope.newJunctionForm.$valid) {
                if ($scope.rowItems[0].component == 'undefined' || $scope.rowItems[0].component == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null) {
                    notificationService.displayError('Please enter component');
                }
                else {
                    apiService.post('api/Junction/SaveJunction', $scope.junction, saveJunctionSucceess, saveJunctionFailed);
                }

            }
            else { notificationService.displayError('Please enter mandatory fields'); }
        };
        function saveJunctionSucceess() {
            $scope.showJNForm = false;
            $scope.addjun = true;
            notificationService.displaySuccess('Junctions Details Saved Succefully');
            $scope.junction = {};
            $scope.ps = '';
            $scope.newJunctionForm.$setPristine();
            $scope.newJunctionForm.$setUntouched();
            $scope.rows = { items: [{}] };
            $scope.junComponents = [];
            //$scope.rows = {
            //    items: [{}]
            //};
            GetJunctionsList();
            GetComponentsList();

        }
        function saveJunctionFailed() {
            notificationService.displayError('Junctions Details Saved Failed');
        }

        ///update junction////
        $scope.UpdateJunction = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/Junction/UpdateJunction', data, UserUpdateComplete, UserUpdateFailed);

        };

        function UserUpdateComplete() {
            notificationService.displaySuccess(' updated user successfully.');
        }

        function UserUpdateFailed() {
            notificationService.displayError('Update user Failed !');
        }
        ///update junction////

        //delete junction////
        $scope.DeleteJun = function DeleteJun(Jun) {
            //$scope.row = Jun;
            alertify.confirm('Delete', 'Are You sure to Delete..!',
                function () {
                    apiService.post('api/Junction/DeleteJun/' + Jun.row_id, null, DeleteJunSuccess, DeleteJunFailure);
                }
                , function () { }).set('reverseButtons', false);
            //apiService.post('api/Junction/DeleteJun/' + Jun.row_id, null, DeleteJunSuccess, DeleteJunFailure);
        }

        function DeleteJunSuccess(response) {
            notificationService.displaySuccess("Jun Deleted Successfully !");
            GetJunctionsList();
            GetComponentsList();
        }
        function DeleteJunFailure(response) {
            notificationService.displayError("Jun Delete Failed. Please try again !");
        }
        //delete junction////


        $scope.components = {};
        $scope.AddComponents = function AddComponents(jn) {
            $scope.components = jn;
            $scope.project_id = jn.project_id;
            alert($scope.project_id);

        }

        $scope.change1 = true;
        $scope.changefunc = function () {
            $scope.change1 = false;
        };

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


        $scope.checkjunction = function (id, psid, junname) {
            for (var i = 0; i < $scope.JunctionsList.length; i++) {
                if ($scope.JunctionsList[i].project_id == id) {
                    if ($scope.JunctionsList[i].ps_id == psid) {
                        if ($scope.JunctionsList[i].junction_name == junname) {
                            notificationService.displayError("this junction already exist please new one");
                            $scope.junction.junction_name = '';
                            document.getElementById(junction_name).focus();
                        }
                    }
                }

            }
        }
        $scope.getprojectname = function (prjctid) {
            for (var i = 0; i < $scope.projectslists.length; i++) {
                if ($scope.projectslists[i].id == prjctid) {
                    return $scope.projectslists[i].project_name;
                }
            }
        }
        $scope.checkjunwork = function (item, index, projectid,psid) {
            var checkfieldworkname = '';
            if ($scope.JunctionsCompList.length) {
                for (var i = 0; i < $scope.JunctionsCompList.length; i++) {
                    if ($scope.JunctionsCompList[i].projectid == projectid && $scope.JunctionsCompList[i].subcontractor_id == sub_id && $scope.JunctionsCompList[i].component == item.component) {
                        checkfieldworkname = 'isDup';
                        break;
                    }
                }
            }
            var arrayCount = 0;
            if ($scope.rows.items.length > 1) {
                for (var i = 0; i < $scope.rows.items.length; i++) {
                    if (index != i) {
                        if ($scope.rows.items[i].component == item.component) {
                            arrayCount++;
                        }
                    }
                }
            }
            if (arrayCount > 0 || checkfieldworkname == 'isDup') {
                notificationService.displayError("Fieldwork is already exits!");
                $scope.rows.items[index].component = '';
            }
        }
    }

})(angular.module('common.core'));