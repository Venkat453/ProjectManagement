(function (app) {
    'use strict';
    app.directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input. 
                    // In such cases, when a letter is typed first, this parser will be called
                    // again, and the 2nd time, the value will be undefined
                    if (inputValue == undefined) return ''
                    var transformedInput = inputValue.replace(/(^0$)|[^0-9]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
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
    app.controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function settingsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

       
        $rootScope.Loadsaveuserlog();
        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.empCodeSettings = {};

        $scope.SaveEmpCodeSettings = function SaveEmpCodeSettings() {
            $scope.empCodeSettings.tenant_id = $scope.tenantID;
            $scope.empCodeSettings.auto_code = $scope.autocode;
            if ($scope.empCodeForm.$valid) {
            apiService.post('api/EmployeeMaster/AddEmployeeCodeSettings', $scope.empCodeSettings, SaveEmpCodeSettingsComplete, SaveEmpCodeSettingsFailed);
            }
            else { notificationService.displayError('Please enter mandatory fields'); }
        }

        function SaveEmpCodeSettingsComplete() {
            notificationService.displaySuccess("Employee Code Settings Saved Successfully !");
            $scope.empCodeSettings = {};
            $scope.empCodeForm.$setPristine();
            $scope.empCodeForm.$setUntouched();
        }

        function SaveEmpCodeSettingsFailed() {
            notificationService.displayError("Employee Code Settings could not be Saved !");
        }

        //LoadEmpDetails();
        //function LoadEmpDetails() {
        //    apiService.get('api/EmployeeMaster/GetEmployeesList', null, LoadEmpComplete, LoadEmpFailed);
        //}

        //function LoadEmpComplete(response) {
        //    notificationService.displaySuccess("Employee loaded success !");
        //}
        //function LoadEmpFailed(response) {
        //    notificationService.displayError("Employee loaded failed !");
        //}
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
    }
})(angular.module('common.core'));