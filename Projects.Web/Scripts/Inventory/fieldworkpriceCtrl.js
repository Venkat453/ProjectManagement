(function (app) {
    'use strict';
    app.controller('fieldworkpriceCtrl', fieldworkpriceCtrl);

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

    app.directive('validNumber', function () {
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

                    var clean = val.replace(/[^-0-9\.]/g, '');
                    var negativeCheck = clean.split('-');
                    var decimalCheck = clean.split('.');
                    if (!angular.isUndefined(negativeCheck[1])) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }

                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        }
    });

    fieldworkpriceCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function fieldworkpriceCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.FieldWork = {};
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
        getFieldsdata();
        function getFieldsdata() {
            apiService.get('api/fieldworkprice/GetFieldWorksList/' + $rootScope.tenant.tenant_id, null, LoadnewFieldworkSucceess, LoadnewFieldworkFailed);
        }
        function LoadnewFieldworkSucceess(response) {
            $scope.FieldworksList = response.data;
            if ($scope.FieldworksList.length == 0) {
                $scope.showfddForm = true;
                $scope.savebtn = true;
                $scope.clearbtn = true;
                $scope.hidebtn = false;
                $scope.addFWP = false;
            }
            else {
                $scope.showfddForm = false;
                $scope.addFWP = true;
            }
        }
        function LoadnewFieldworkFailed() {
            notificationService.displayError('fetching Field works list failed');
           
        }

        $scope.showfieldform = function () {
            if ($scope.showfddForm == false) {
                $scope.showfddForm = true;
                $scope.addFWP = false;
                $scope.addFieldWorkForm.$setPristine();
                $scope.addFieldWorkForm.$setUntouched();
                $scope.FieldWork = {};
                $scope.hidebtn = true;
                $scope.clearbtn = false;
                $scope.savebtn = true;
            }
            else {
                $scope.showfddForm = false;
                $scope.addFWP = true;
            }
        };
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

        $scope.validateRequired = function (value) {
            if (!value)
                return "Price Required";
        }; 
        $scope.editCall = function (rowform) {
            if ($(".checkVisible").is(":visible")) {
                rowform.$cancel();
            }
            else {
                rowform.$show();
            }
        };
        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.FieldWork = {};
            $scope.addFieldWorkForm.$setPristine();
            $scope.addFieldWorkForm.$setUntouched();
            $scope.FieldWork.project_id = '';
            $scope.FieldWork.unit_of_measurement = '';
        }
        $scope.hideUserForm = function () {
            $scope.showfieldform();
        }
        ///for clear and cancel buttons///
        
        $scope.addfieldwork = function () {
            $scope.FieldWork.tenant_id = $rootScope.tenant.tenant_id;
            if ($scope.addFieldWorkForm.$valid) {
                apiService.post('api/fieldworkprice/SaveFieldWorkPrice', $scope.FieldWork, saveFieldWorkSucceess, saveFieldWorkFailed);
            }
            else { notificationService.displayError('Please enter mandatory fields'); }
        }
        function saveFieldWorkSucceess(response) {
            $rootScope.fieldworkslist = response.data;
            $scope.showfddForm = false;
            $scope.addFWP = true;
            notificationService.displaySuccess('fieldwork Details Saved Successfully');
            getFieldsdata();
            $scope.FieldWork = {};
            $scope.FieldWork = null;
            $scope.addFieldWorkForm.$setPristine();
            $scope.addFieldWorkForm.$setUntouched();
        }

        function saveFieldWorkFailed() {
            notificationService.displayError('fieldwork Details Saved Failed');
        }
        //$scope.getFieldworkByProjId = function (project_id) {
        //    apiService.get('api/fieldworkprice/GetFieldWorksListByprojId/' + project_id, null, LoadFieldworkSucceess, LoadFieldworkFailed);
        //    $scope.showdiv = true;
        //};
        //function LoadFieldworkSucceess(response) {
        //    $scope.FieldworksList = response.data;
        //    for (var i = 0; i < $scope.FieldworksList.length; i++) {
        //        for (var j = 0; j < $scope.Refmaster.length; j++) {
        //            if ($scope.FieldworksList[i].unit_of_measurement == $scope.Refmaster[j].id) {
        //                $scope.FieldworksList[i].UOM = $scope.Refmaster[j].reference_value;
        //            }
        //        }
        //    }
        //}
        //function LoadFieldworkFailed() {
        //    notificationService.displayError('fetching Field works list failed');
        //    $scope.showdiv = false;
        //}
        
        $scope.saveUser = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/fieldworkprice/updatefieldworkprice', data, FieldWorkUpdateComplete, FieldWorkUpdateFailed);
        };
        function FieldWorkUpdateComplete() {
            notificationService.displaySuccess(' FieldWork price updated  successfully.');
            GetMaterialList();
        }

        function FieldWorkUpdateFailed() {
            notificationService.displayError('FieldWork price updated Failed !');
        }
        $scope.checkfield = function (id,name) {
            for (var i = 0; i < $scope.FieldworksList.length; i++) {
                if ($scope.FieldworksList[i].project_id == id) {
                    if ($scope.FieldworksList[i].fieldwork_name == name) {
                        notificationService.displayError("already exist under this project enter new one");
                        $scope.FieldWork.fieldwork_name = '';
                        document.getElementById(FieldWorkName).focus();
                    }
                }
            }
        }
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
    }

})(angular.module('common.core'));