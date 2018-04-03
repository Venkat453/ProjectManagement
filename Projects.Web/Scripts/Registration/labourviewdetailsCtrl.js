(function (app) {
    'use strict';

    app.controller('labourviewdetailsCtrl', labourviewdetailsCtrl);

    labourviewdetailsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modalInstance', 'labors'];

    
    function labourviewdetailsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modalInstance, labors) {
        $scope.labors = labors;

        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }

        $scope.downLoadImage = function (data, filetype) {
            var a = document.createElement('a');
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = ' aadharForm.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'aadhar.pdf';
                a.click();
            }
        }
    }

})(angular.module('common.core'));