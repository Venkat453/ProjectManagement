(function (app) {
    'use strict';

    app.controller('VEhicleviewdetailsCtrl', VEhicleviewdetailsCtrl);

    VEhicleviewdetailsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modalInstance', 'vehicle'];


    function VEhicleviewdetailsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modalInstance, vehicle) {
        $scope.vehicle = vehicle;

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }

        $scope.downLoadImage = function (data,filetype) {
            var a = document.createElement('a');
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = ' agreementForm.jpeg';
                a.click();
            }

            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'agreementForm.pdf';
                a.click();
            }
           
        }

        
    }

})(angular.module('common.core'));