(function (app) {
    app.controller('employeemasterCtrl', employeemasterCtrl);

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
                    var clean = val.replace(/[^0-9]+/g, '');
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

    employeemasterCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']

    function employeemasterCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $rootScope.Loadsaveuserlog();
        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.emp = {};
        $scope.maxDate = new Date();

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
        $scope.clearbtn = true;
        $scope.hidebtn = false;
        /////for cancel &Clear button/////
        $scope.Clearform = function () {
            $scope.emp = {};
            $scope.project_id = '';
            $scope.empRegForm.$setPristine();
            $scope.empRegForm.$setUntouched();
        }
        $scope.hideUserForm = function () {
            $scope.showEmpform();
            $scope.empForm = false;
            $scope.addemp = true;
            $scope.emp = {};
            $scope.empRegForm.$setPristine();
            $scope.empRegForm.$setUntouched();
        }
        /////for cancel &Clear button/////

       
        $scope.addemp = true;
        $scope.empForm = false;
        $scope.showEmpform = function () {
            if ($scope.empForm == false) {
                $scope.empForm = true;
                $scope.empRegForm.$setPristine();
                $scope.empRegForm.$setUntouched();
                $scope.addemp = false;
                $scope.hidebtn = true;
                $scope.clearbtn = false;
            }
            else {
                $scope.empForm = false;
                $scope.addemp = true;
                $scope.hidebtn = false;
                $scope.clearbtn = true;
            }

        };
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
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

        $scope.Saveemp = function () {
            $scope.emp.tenant_id = $scope.tenantID;
            $scope.emp.project_id = $scope.project_id;
           // $scope.emp. = $scope.project_id;
           $scope.emp.CreatedBy = $rootScope.tenant.user_id;

            if ($scope.empRegForm.$valid) {
                apiService.post('api/EmployeeMaster/AddEmployee', $scope.emp, SaveEmpCodeSettingsComplete, SaveEmpCodeSettingsFailed);
            }
            else { notificationService.displayError('Please enter mandotory fields'); }
        };

        function SaveEmpCodeSettingsComplete() {

            notificationService.displaySuccess("Employee Saved Successfully !");
            LoadEmpDetails();
            $scope.empForm = false;
            $scope.emp = {};
            $scope.project_id = '';
            $scope.empRegForm.$setPristine();
            $scope.empRegForm.$setUntouched();
            $scope.project_id = '';
            $scope.addemp = true;
        }

        function SaveEmpCodeSettingsFailed() {
            notificationService.displayError("Employee not Saved !");
            //$scope.empCodeSettings = '';
        }

        LoadEmpDetails();
        function LoadEmpDetails() {
            apiService.get('api/EmployeeMaster/GetEmployees/' + $rootScope.tenant.tenant_id, null, LoadEmpComplete, LoadEmpFailed);
        }

        function LoadEmpComplete(response) {
            $scope.EmployeesList = response.data;
            $scope.myData = $scope.EmployeesList;
            //notificationService.displaySuccess("Employee loaded success !");
        }
        function LoadEmpFailed(response) {
            notificationService.displayError("Employee loaded failed !");
        }
        
        $scope.getProjectName = function (Employee) {
          
            var prjctName = '';
            for (var i = 0; i < $scope.projectslists.length; i++) {
                if ($scope.projectslists[i].id == Employee.project_id) {
                    prjctName = $scope.projectslists[i].project_name;
                }
            }
            return prjctName;
        };

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        //$scope.search = function (row) {
        //    //return ((row.project_name.indexOf($scope.project || '') !== -1));
        //    $scope.result = row.emp_name.indexOf($scope.employee || '') !== -1;
        //    return $scope.result;
        //};
    }
})(angular.module('common.core'));