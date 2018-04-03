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
                    var transformedInput = inputValue.replace(/(^0$)|[^0-9.]/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });

    app.controller('WbilabourCtrl', WbilabourCtrl);

    WbilabourCtrl.$inject = ['$scope','$rootScope', 'apiService', 'membershipService', 'notificationService', '$location', '$filter', 'labors', '$modalInstance'];
    function WbilabourCtrl($scope, $rootScope, apiService, membershipService, notificationService, $location, $filter, labors, $modalInstance) {

        $rootScope.Loadsaveuserlog();
        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        $scope.labors = labors;
        $scope.indlbrlists = [];
        $scope.induction_wbino = '';
        $scope.lbrinddetails = {};

        //GetLabourList();
        //function GetLabourList() {
        //    apiService.get('api/Labour/GetLaboursList', null, LoadlabourSucceess, LoadlabourFailed);
        //}
        //function LoadlabourSucceess(response) {
        //    $scope.LaboursList = response.data;
         
        //}
        //function LoadlabourFailed() {
        //    notificationService.displayError('fetching Workers list failed');
        //}

        GetLabourList();
        function GetLabourList() {
            apiService.get('api/Induction/Inductionlabourlist/' + $rootScope.tenant.tenant_id, null, LoadLabourSucceess, LoadLabourFailed);
        }
        function LoadLabourSucceess(response) {
            $scope.LaboursList = response.data;
        }
        function LoadLabourFailed() {
            notificationService.displayError('fetching Workers list failed');
        }


        GetindlbrList();
        function GetindlbrList() {
            apiService.get('api/Induction/GetindlbrList', null, LoadindentSucceess, LoadindentFailed);
        }
        function LoadindentSucceess(response) {
            $scope.indlbrlists = response.data;

        }
        function LoadindentFailed() {
            notificationService.displayError('getting indlbr failed');
        }


        
        $scope.registerwbi = function (labors) {            
            $scope.lbrinddetails.tenant_id = $rootScope.tenant.tenant_id;
            $scope.lbrinddetails.project_id = labors.project_id;
            //$scope.lbrinddetails.ma = $scope.labors.master_emp_id,
            $scope.lbrinddetails.master_emp_id = $scope.labors.master_emp_id,
            $scope.lbrinddetails.name = $scope.labors.name;
            $scope.lbrinddetails.date_of_joining = $scope.labors.created_date;
            $scope.lbrinddetails.wbi_no = $scope.induction_wbino;
            $scope.lbrinddetails.empcode = $scope.labors.empcode;
            $scope.status = 'original';
            if ($scope.newwbiForm.$valid) {
                if ($scope.indlbrlists.length != 0) {
                    for (var i = 0; i < $scope.indlbrlists.length; i++) {
                        if ($scope.indlbrlists[i].wbi_no == $scope.induction_wbino) {
                            $scope.status = 'duplicate';
                            notificationService.displayError("WbiNumber already given please enter another one");
                            $scope.induction_wbino = '';
                            document.getElementById('wbino').focus();
                            break;
                        }
                    }
                    if ($scope.status != 'duplicate') {
                        apiService.post('api/Induction/Saveinduct', $scope.lbrinddetails, SaveLabourSucceess, SaveLabourFailed);
                        $scope.status = 'original';
                    }

                }
                else {
                    apiService.post('api/Induction/Saveinduct', $scope.lbrinddetails, SaveLabourSucceess, SaveLabourFailed);
                    $scope.status = 'original';
                }
            }
            else {
                notificationService.displayError("please enter WbiNumber ");
            }
        }
        
        function SaveLabourSucceess() {
            $rootScope.currentModel = $scope.lbrinddetails.master_emp_id;
            notificationService.displaySuccess("WbiNumber saved succesfully");
            closeclientmodal()
        }
        function SaveLabourFailed() {
            notificationService.displayError('WbiNumber saved failed');
        }

        //$scope.checkinductionmbr = function () {
        //    for (var i = 0; i < $scope.indlbrlists.length; i++) {
        //        if ($scope.indlbrlists[i].wbi_no == $scope.induction_wbino) {
        //            notificationService.displayError("wbi_no already given please enter another one");
        //            $scope.induction_wbino = '';
        //            document.getElementById('wbino').focus();
        //        }
        //    }
        //};

    }
    })(angular.module('common.core'));