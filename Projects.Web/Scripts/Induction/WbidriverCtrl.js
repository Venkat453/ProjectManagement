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
    app.controller('WbidriverCtrl', WbidriverCtrl);

    WbidriverCtrl.$inject = ['$scope', '$rootScope', 'apiService', 'membershipService', 'notificationService', '$location', '$filter', 'vehicle', '$modalInstance'];
    function WbidriverCtrl($scope, $rootScope, apiService, membershipService, notificationService, $location, $filter, vehicle, $modalInstance) {

        $rootScope.Loadsaveuserlog();
        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }

        
        $scope.vehicle = vehicle;
        $scope.driverIndDetails = {};
        // $scope.labors.created_date = new Date($scope.labors.created_date);
        $scope.newinduction_wbino = '';
        

        GetdriverList();
        function GetdriverList() {
            apiService.get('api/Induction/Inductiondriverlist/' + $rootScope.tenant.tenant_id , null, vehicleListLoadComplete, vehicleListLoadFailed);
        }
        function vehicleListLoadComplete(response) {
            $scope.vehicleslists = response.data;
           
        }
           function vehicleListLoadFailed() {
            notificationService.displayError('fetching vehiclelist failed');
        }


           $scope.registerwbidriver = function (vehicle) {
               $scope.driverIndDetails.tenant_id = $rootScope.tenant.tenant_id;
               $scope.driverIndDetails.project_id = vehicle.project_id;
               $scope.driverIndDetails.master_emp_id = $scope.vehicle.master_emp_id;
               $scope.driverIndDetails.empcode = $scope.vehicle.empcode;
               $scope.driverIndDetails.name = $scope.vehicle.driver_name;
               $scope.driverIndDetails.date_of_joining = $scope.vehicle.created_date;
               //$scope.driverIndDetails.induction_date = $scope.vehicle.driver_name;
               $scope.driverIndDetails.wbi_no = $scope.newinduction_wbino;
               if ($scope.newwbiForm.$valid) {
                   $scope.status = 'original';
                   // alert($scope.driverIndDetails.wbi_no);     
                   if ($scope.indlbrlists.length != 0) {
                       for (var i = 0; i < $scope.indlbrlists.length; i++) {
                           if ($scope.indlbrlists[i].wbi_no == $scope.newinduction_wbino) {
                               $scope.status = 'duplicate';
                               notificationService.displayError("WbiNumber already given please enter another one");
                               $scope.newinduction_wbino = '';
                               document.getElementById('wbino').focus();
                               break
                           }
                       }
                       if ($scope.status != 'duplicate') {
                           apiService.post('api/Induction/Saveinductdriver', $scope.driverIndDetails, SavedriverSucceess, SavedriverFailed);
                           $scope.status = 'original';
                       }

                   }
                   else {
                       apiService.post('api/Induction/Saveinductdriver', $scope.driverIndDetails, SavedriverSucceess, SavedriverFailed);
                       $scope.status = 'original';
                   }
               }
               else {
                   notificationService.displayError("please enter WbiNumber ");
               }
        }

           function SavedriverSucceess() {
            $rootScope.currentModel1 = $scope.driverIndDetails.master_emp_id;
            notificationService.displaySuccess("WbiNumber saved succesfully")
            closeclientmodal()
        }
        function SavedriverFailed() {
            notificationService.displayError('WbiNumber saved failed');
           }

       
    }
})(angular.module('common.core'));