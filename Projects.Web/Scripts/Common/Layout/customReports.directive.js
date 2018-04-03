(function (app) {
    'use strict';

    app.directive('customReport', customReport);

    function customReport(Excel) {
        return {
            restrict: 'AE',
            replace: true,
            scope: { listData: '=' },
            templateUrl: '/Scripts/Common/Layout/customReport.html',
            link: function ($scope, $element, $attrs, $window) {
                //alert($scope.listData[0]);
                $scope.thtxtCol = '#ffffff';
                $scope.hdbgCol = '#336699';
                $scope.bgCol = '#ffffcc';
                $scope.brdrCol = 'solid 1px black';


                $scope.listColumns = [];
                $scope.$watch('listData', function () {
                    for (var name in $scope.listData[0]) {
                        $scope.listColumns.push(name);
                    }
                    $scope.updatedFields = $scope.listColumns;                    
                });                
                
                //selecting required fields..
                var startCount = 0;
                $scope.addOrRemoveField = function (field, checkedStatus) {
                    if (startCount == 0) { $scope.updatedFields = []; }
                    //alert(field + '--' + checkedStatus + '--' + getIndexNo(field, $scope.updatedFields));                    
                    if (checkedStatus == true) {
                        $scope.updatedFields.push(field);
                    }
                    else if (checkedStatus == false) {
                        $scope.updatedFields.splice(getIndexNo(field, $scope.updatedFields), 1);
                    }
                    startCount++;
                };

                $scope.SelectAllTog = "Select All";
                $scope.selectAllFields = function (checked) {
                    if (checked == true) { $scope.updatedFields = $scope.listColumns; $scope.SelectAllTog = "UnSelect All"; }
                    else if (checked == false) { $scope.updatedFields = []; $scope.SelectAllTog = "Select All";}
                };


                //gruopby functionlaity...
                $scope.RowField = '';
                $scope.ColField = '';
                $scope.typeCalc = '';
                $scope.RowFieldList = [];
                $scope.ColFieldList = [];

                $scope.GruopByReport = function () {
                    alert($scope.RowField + ' ' + $scope.ColField + ' ' + $scope.typeCalc);
                    alert($scope.updatedFields[0]);
                    $scope.copyListData = $scope.listData;
                    
                    var record = {};
                    var x = 'novalue';

                    var dupCheck = '';
                    for (var i = 0; i < $scope.copyListData.length; i++) {
                        //alert($scope.copyListData[i]);
                        record = $scope.copyListData[i];
                        x = record[$scope.RowField];

                        if (dupCheck != x)
                        {
                            $scope.RowFieldList.push(x);
                        }
                        dupCheck = x;
                    }

                    $scope.listData = $scope.RowFieldList;
                    alert($scope.listData[0]);


                    var dupCheck2 = '';
                    var y = 'novalue';
                    for (var i = 0; i < $scope.copyListData.length; i++) {
                        record = $scope.copyListData[i];
                        y = record[$scope.ColField];
                        if (dupCheck2 != y)
                        {
                            $scope.ColFieldList.push(y);
                        }
                        dupCheck2 = y;
                    }

                    $scope.updatedFields = $scope.ColFieldList;
                    alert($scope.updatedFields[0]);

                };





                //getting index_no based on value..
                function getIndexNo(value, array) {
                    var index = -1;
                    var comArr = eval(array);
                    for (var i = 0; i < comArr.length; i++) {
                        if (comArr[i] === value) {
                            index = i;
                            return index;
                        }
                    }
                }



                $scope.printDiv = function () {
                    var divToPrint = document.getElementById('reportTable');
                    var newWin = window.open("");
                    if (divToPrint != null || divToPrint == undefined) {
                        newWin.document.write(divToPrint.outerHTML);
                        newWin.print();
                        newWin.close();
                    }
                };

                $scope.exportToPdf = function () {
                    var pdf = new jsPDF('p', 'pt', 'letter');
                    // source can be HTML-formatted string, or a reference
                    // to an actual DOM element from which the text will be scraped.
                    var source = $('#reportDiv')[0];

                    // we support special element handlers. Register them with jQuery-style 
                    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
                    // There is no support for any other type of selectors 
                    // (class, of compound) at this time.
                    var specialElementHandlers = {
                        // element with id of "bypass" - jQuery style selector
                        '#bypassme': function (element, renderer) {
                            // true = "handled elsewhere, bypass text extraction"
                            return true
                        }
                    };
                    var margins = {
                        top: 80,
                        bottom: 60,
                        left: 40,
                        width: 522
                    };
                    // all coords and widths are in jsPDF instance's declared units
                    // 'inches' in this case
                    pdf.fromHTML(
                        source, // HTML string or DOM elem ref.
                        margins.left, // x coord
                        margins.top, { // y coord
                            'width': margins.width, // max width of content on PDF
                            'elementHandlers': specialElementHandlers
                        },

                        function (dispose) {
                            // dispose: object with X, Y of the last line add to the PDF 
                            //          this allow the insertion of new lines after html
                            pdf.save('CustomReport.pdf');
                        }, margins);
                };

                $scope.exportToExcel = function () {
                    var exportHref = Excel.tableToExcel('#reportTable', 'Sheet1');
                    var a = document.createElement('a');
                    a.href = exportHref;
                    a.download = 'CustReport.xls';
                    a.click();
                };
                

            }
        };
    }
})(angular.module('common.ui'));