(function (app) {
    'use strict';

    app.controller('projectmasterCtrl', projectmasterCtrl);

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


    projectmasterCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function projectmasterCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.tenantID = $rootScope.tenant.tenant_id;
        // $scope.ProjectID = $rootScope.id;
        //$scope.pm={};
        $scope.projectslist = [];
        $scope.totalItems = 0;

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
        $scope.addbtn = true;
        $scope.showPMForm = false;
        $scope.clearbtn = true;
        $scope.hidebtn = false;
        $scope.showAddform = function () {
            if ($scope.showPMForm == false) {

                $scope.showPMForm = true;
                $scope.addbtn = false;
                $scope.hidebtn = true;
                $scope.clearbtn = false;
                $scope.ProjectMasterForm.$setPristine();
                $scope.ProjectMasterForm.$setUntouched();
            }
            else {
                $scope.showPMForm = false;
                $scope.addbtn = true;
                $scope.hidebtn = false;
                $scope.clearbtn = true;
                $scope.ProjectMasterForm.$setPristine();
                $scope.ProjectMasterForm.$setUntouched();
            }
        };
        /////for cancel &Clear button/////
        $scope.Clearform = function () {
            $scope.pm = {};
            $scope.ProjectMasterForm.$setPristine();
            $scope.ProjectMasterForm.$setUntouched();
        }
        $scope.hideUserForm = function () {
            $scope.showPMForm = false;
            $scope.addbtn = true;
            $scope.pm = {};
            $scope.ProjectMasterForm.$setPristine();
            $scope.ProjectMasterForm.$setUntouched();
        }
        /////for cancel &Clear button/////
        function resetForm($form) {
            $form.find('input:text, input:password, input:file, select, textarea').val('');
            $form.find('input:radio, input:checkbox')
                .removeAttr('checked').removeAttr('selected');
        }

        $scope.pm = {};
        $scope.SaveProject = function SaveProject() {

            $scope.pm.id = $scope.ProjectID;
            $scope.pm.tenant_id = $scope.tenantID;
           // $scope.pm.user_id = $rootScope.tenant.user_id;
            if ($scope.ProjectMasterForm.$valid) {
                apiService.post('api/ProjectMaster/SaveProjectMaster', $scope.pm, SaveProjectSuccess, SaveProjectFailed);
            }
            else {
                notificationService.displayError("please enter mandatory fields");
            }
        }

        function SaveProjectSuccess(response) {
            notificationService.displaySuccess('Project saved Successfully!');
            $scope.pm.project_name = '';
            resetForm($('#ProjectMasterForm'));
            $scope.ProjectMasterForm.$setPristine();
            $scope.ProjectMasterForm.$setUntouched();
            LoadProjectsList();
            $scope.showPMForm = false;
            $scope.addbtn = true;
            $scope.pm = {};
        }

        function SaveProjectFailed() {
            notificationService.displayError('ProjectMaster was not saved!');
            LoadProjectsList();
        }

        LoadProjectsList();
        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
            //apiService.get('api/ProjectMaster/GetnewProjectsList/' + $rootScope.tenant.user_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $rootScope.projectslists = response.data;
            $scope.projectslist = $rootScope.projectslists;
            $scope.totalItems = $scope.projectslist.length;
            //notificationService.displaySuccess('ProjectMaster Load Successfully!');
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('unable to get Project List');
        }
        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        $scope.checkproject = function (name) {
            for (var i = 0; i < $scope.projectslist.length; i++) {
                if ($scope.projectslist[i].project_name == name) {
                    notificationService.displayError("this project already registred enter new one");
                    $scope.pm.project_name = '';
                    document.getElementById('Project_Name').focus();
                }

            }
        }
                     
        //$scope.search = function (row) {
        //     return ((row.project_name.indexOf($scope.project || '') !== -1));
        //     $scope.result = (row.project_name.indexOf($scope.newproject || '') !== -1);
        //     return $scope.result;
        //};
    }
})(angular.module('common.core'));