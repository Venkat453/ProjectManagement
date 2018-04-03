(function (app) {
    'use strict';

    //app.factory('Excel', function ($window) {
    //    var uri = 'data:application/vnd.ms-excel;base64,',
    //        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    //        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
    //        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    //    return {
    //        tableToExcel: function (tableId, worksheetName) {
    //            var table = $(tableId).clone(),
    //                ctx = { worksheet: worksheetName, table: table.html() },
    //                href = uri + base64(format(template, ctx));
    //            return href;
    //        }
    //    };
    //});

    app.controller('sampleReportsCtrl', sampleReportsCtrl);

    sampleReportsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$modal', '$mdDialog', '$filter', 'Excel'];

    function sampleReportsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $modal, $mdDialog, $filter,Excel) {

        $rootScope.Loadsaveuserlog();
        $scope.SCList = [];
        $scope.employ = [
        { id: 11, name: 'bob' },
        { id: 12, name: 'bob' },
        { id: 13, name: 'bob' }
        ];

        LoadMaster();
        function LoadMaster() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);

        }

        function SubContractorsListLoadComplete(response) {
            $scope.SCList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('fetching subcontractorslist failed');
        }

        $scope.getbFile = function () {
            apiService.get('api/Dashboard/GetBase64File', null, getFileComplete, getFileFailed);
        };
        function getFileComplete(response) {
            var bFile = response.data;

            var a = document.createElement('a');

            a.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + bFile;
            a.download = ' MyReport.xls';
            a.click();

        }
        function getFileFailed() {
            notificationService.displayError('failed to get file');
        }

        $scope.getPdfFile = function () {
            apiService.get('api/Dashboard/GetPdfFile', null, getPdfFileComplete, getPdfFileFailed);
        };
        function getPdfFileComplete(response) {
            var pbFile = response.data;

            var a = document.createElement('a');

            a.href = 'data:application/pdf;base64,' + pbFile;
            a.download = 'MyPdfDoc.pdf';
            a.click();

        }
        function getPdfFileFailed() {
            notificationService.displayError('failed to get pdf file');
        }

        $scope.getxlsFile = function () {
            var exportHref = Excel.tableToExcel('#reportTable', 'Sheet1');
            var a = document.createElement('a');
            a.href = exportHref;
            a.download = 'CustReport.xls';
            a.click();
        };
    }
})(angular.module('common.core'));