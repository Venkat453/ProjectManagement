(function (app) {
    'use strict';

    app.controller('materialManagementCtrl', materialManagementCtrl);

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
                    var clean = val.replace(/(^0$)|[^0-9.]/g, '');
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
        };
    });



    materialManagementCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function materialManagementCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.Refmaster = $rootScope.ReferenceMasterData;
      
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname; 
            $scope.reverse = !$scope.reverse; 
        }

        $scope.editCall = function (rowform) {
            if ($(".checkVisible").is(":visible"))
            {
                rowform.$cancel();
            }
            else
            {
                rowform.$show();
            }
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
        GetMaterialList();

        function GetMaterialList() {
            apiService.get('api/MaterialPrice/GetMaterialList/' + $rootScope.tenant.tenant_id, null, LoadnewMaterialSucceess, LoadnewMaterialFailed);
        }
        function LoadnewMaterialSucceess(response) {
            $scope.MaterialList = response.data;
            if ($scope.MaterialList.length == 0) {
                $scope.showMMForm = true;
                $scope.savebtn = true;
                $scope.clearbtn = true;
                $scope.hidebtn = false;
                $scope.addMTRL = false;
            }
            else {
                $scope.showMMForm = false;
                $scope.addMTRL = true;
            }
        }
        function LoadnewMaterialFailed() {
            notificationService.displayError("getmaterial liat loaded failed")
        }
        $scope.showmatform = function () {
            if ($scope.showMMForm == false) {
                $scope.showMMForm = true;
                $scope.addMTRL = false;
                $scope.addMaterialForm.$setPristine();
                $scope.addMaterialForm.$setUntouched();
                $scope.material = {};
                $scope.hidebtn = true;
                $scope.savebtn = true;
                $scope.clearbtn = false;
            }
            else {
                $scope.showMMForm = false;
                $scope.addMTRL = true;
            }

        };
        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.material = {};
            $scope.addMaterialForm.$setPristine();
            $scope.addMaterialForm.$setUntouched();
            $scope.material.project_id = '';
            $scope.material.unit_of_measurement = '';
        }
        $scope.hideUserForm = function () {
            $scope.showmatform();
        }
        ///for clear and cancel buttons///
        $scope.addMaterial = function () {
            $scope.material.tenant_id = $rootScope.tenant.tenant_id;
            if ($scope.addMaterialForm.$valid) {
                apiService.post('api/MaterialPrice/SaveMaterialPrice', $scope.material, saveMaterialSucceess, saveMaterialFailed);
            }
            else { notificationService.displayError('Please enter mandatory details'); }
        };
        function saveMaterialSucceess() {
            $scope.showMMForm = false;
            $scope.addMTRL = true;
            notificationService.displaySuccess('Material Details Saved Successfully');
            GetMaterialList();
            $scope.material = {};
            $scope.material = null;
            $scope.addMaterialForm.$setPristine();
            $scope.addMaterialForm.$setUntouched();
        }

        function saveMaterialFailed() {
            notificationService.displayError('Material Details Saved Failed');
        }

        $scope.saveUser = function (data, id) {
            angular.extend(data, { id: id });
            apiService.post('api/MaterialPrice/updatematerial', data, UserUpdateComplete, UserUpdateFailed);
        };
        function UserUpdateComplete() {
            notificationService.displaySuccess(' material price updated  successfully.');
            GetMaterialList();
        }

        function UserUpdateFailed() {
            notificationService.displayError('material price updated Failed !');
        }

        $scope.validateRequired = function (value) {
            if (!value)
                return "Required field";
        };
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        $scope.checkmaterial = function (id, name) {
            for (var i = 0; i < $scope.MaterialList.length; i++) {
                if ($scope.MaterialList[i].project_id == id) {
                    if ($scope.MaterialList[i].material_name == name) {
                        notificationService.displayError("already exist under this project enter new one");
                        $scope.material.material_name = '';
                        document.getElementById(materialname).focus();
                    }
                }
            }
        }
       
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
        //$scope.getMaterialsByProjId = function (project_id) {
        //    apiService.get('api/MaterialPrice/GetMaterialListByProjId/' + project_id, null, LoadMaterialSucceess, LoadMaterialFailed);
        //    $scope.showdiv = true;
        //};
        //function LoadMaterialSucceess(response) {
        //    $scope.MaterialList = response.data;
        //    //for (var i = 0; i < $scope.MaterialList.length; i++) {
        //    //    for (var j = 0; j < $scope.Refmaster.length; j++) {
        //    //        if ($scope.MaterialList[i].unit_of_measurement == $scope.Refmaster[j].id) {
        //    //            $scope.MaterialList[i].unit_of_measurement = $scope.Refmaster[j].reference_value;
        //    //        }
        //    //    }
        //    //}
        //    for (var i = 0; i < $scope.Refmaster.length; i++) {
        //        for (var j = 0; j < $scope.MaterialList.length; j++) {
        //            if ($scope.Refmaster[i].id == $scope.MaterialList[j].unit_of_measurement) {
        //                $scope.MaterialList[j].unit_of_measurement = $scope.Refmaster[i].reference_value;
        //            }
        //        }
        //    }
           
        //}
        //function LoadMaterialFailed() {
        //    notificationService.displayError('fetching material list failed');
        //    $scope.showdiv = false;
        //}
        //$scope.checkmaterial = function () {
        //    for (var i = 0; i < $scope.MaterialList.length; i++) {
        //        if ($scope.MaterialList[i].material_name == $scope.material.material_name) {
        //            notificationService.displayError("materail already existed please enter another one");
        //            $scope.material.material_name = '';
        //            document.getElementById('materialname').focus();
        //        }
        //    }
        //};
    }
})(angular.module('common.core'));