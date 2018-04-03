(function (app) {
    'use strict';
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

    app.controller('createIndentCtrl', createIndentCtrl);

    createIndentCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function createIndentCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();
        $scope.material = {};
        $scope.indentdetails = [];
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.SCList = $rootScope.SCMasterList;
        $scope.GetIndentList = [];
      //  $scope.showdiv = false;

        GetIndentdetails();
        function GetIndentdetails() {
            apiService.get('api/indent/GetIndentdetails/' + $rootScope.tenant.tenant_id, null, GetIndentdetailsComplete, GetIndentdetailsFailed);
        }
        function GetIndentdetailsComplete(response) {
            $scope.GetIndentdetailslist = response.data;
        }
        function GetIndentdetailsFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }

        GetMaterialList();
        function GetMaterialList() {
            apiService.get('api/MaterialPrice/GetMaterialList/' + $rootScope.tenant.tenant_id, null, LoadMaterialSucceess, LoadMaterialFailed);
        }
        function LoadMaterialSucceess(response) {
            $scope.MaterialList = response.data;
        }
        function LoadMaterialFailed() {
            notificationService.displayError('fetching material list failed');
        }
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

     
        GetSubContractorsList();
        function GetSubContractorsList() {
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function SubContractorsListLoadComplete(response) {
            $scope.SubContractorsList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('Fetching Subcontractorslist Failed');
        }
        Getindentlist();
        function Getindentlist() {
            apiService.get('api/indent/GetIndent/' + $rootScope.tenant.tenant_id, null, GetIndentLoadComplete, GetIndentFailed)
        }

        function GetIndentLoadComplete(response) {
            $scope.GetIndentlist = response.data;
            if ($scope.GetIndentlist.length == 0) {
                $scope.showIndentForm = true;
                $scope.savebtn = true;
                $scope.clearbtn = true;
                $scope.hidebtn = false;

            }
            else {
                $scope.showIndentForm = false;
                $scope.addind = true;
            }
            for (var i = 0; i < $scope.SCList.length; i++) {
                for (var j = 0; j < $scope.GetIndentlist.length; j++) {
                    if ($scope.SCList[i].id == $scope.GetIndentlist[j].SubContractor_id) {
                        $scope.GetIndentlist[j].SubContractor_id = $scope.SCList[i].subcontractor_name;
                    }
                }
            }
        }
        function GetIndentFailed() {
            notificationService.displayError('fetching GetProject MasterList failed');
        }
        $scope.showAddIndentform = function () {
            if ($scope.showIndentForm == false) {
                $scope.showIndentForm = true;
                $scope.addind = false;
                $scope.savebtn = true;
                $scope.clearbtn = false;
                $scope.hidebtn = true;
                $scope.indentlist = {};
                $scope.newIndentForm.$setPristine();
                $scope.newIndentForm.$setUntouched();
                $scope.indentfile = '';
                $scope.indent.project_id = '';
                $scope.indent.SubContractor_id = '';
                $scope.indent.authorized_by = '';
                $scope.indent.recieved_by = '';
                $scope.indent.date_required = '';
                $scope.indent.date_recieved = '';
                $scope.indent.indent_no = '';
                //$scope.rws.total_price = '';
            }
            else {
                $scope.showIndentForm = false;
                $scope.addind = true;
            }
        };

        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.indentlist = {};
            $scope.newIndentForm.$setPristine();
            $scope.newIndentForm.$setUntouched();
            $scope.indentfile = '';
            $scope.indent.project_id = '';
            $scope.indent.SubContractor_id = '';
            $scope.indent.authorized_by = '';
            $scope.indent.recieved_by = '';
            $scope.indent.date_required = '';
            $scope.indent.date_recieved = '';
            $scope.indent.indent_no = '';
            $scope.rws.total_price = '';
        }
        $scope.hideUserForm = function () {
            $scope.showAddIndentform();
            $scope.showIndentForm = false;
            $scope.addind = true;
        }
        ///for clear and cancel buttons///


        //pagination- no. per page dropdown......
        $scope.page = {};
        $scope.page.levelsArr = [
            { value: "5", label: "Records Per Page" },
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
        $scope.indent = {};
        $scope.indentlist = {};
        
        $scope.rows = {
            items: [{}]
        };
        $scope.addRow = function () {
            $scope.rows.items.push({
            });
        }
        $scope.removeItem = function (m) {
            $scope.rows.items.splice($scope.rows.items.indexOf(m), 1);
        }
        $scope.indentdetails = [];
        $scope.SaveIndent = function () {
            $scope.rowItems = $scope.rows.items;
            $scope.indentlist = {
                'tenant_id': $rootScope.tenant.tenant_id,
                'project_id': $scope.indent.project_id,
                'indent_no': $scope.indent.indent_no,
                'SubContractor_id': $scope.indent.SubContractor_id,
                'authorized_by': $scope.indent.authorized_by,
                'recieved_by': $scope.indent.recieved_by,
                'recieved_from': $scope.indent.recieved_from,
                'date_recieved': $scope.indent.date_recieved,
                'date_required': $scope.indent.date_required,
                'indentdetails': $scope.indentdetails,
            }
            for (var i = 0; i < $scope.rowItems.length; i++) {
                if ($scope.rowItems[0].material_name == 'undefined' || $scope.rowItems[0].material_name == null || $scope.rowItems[0].material_description == 'undefined' || $scope.rowItems[0].material_description == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null || $scope.rowItems[0].unit_of_measurement == 'undefined' || $scope.rowItems[0].unit_of_measurement == null || $scope.rowItems[0].material_price == 'undefined' || $scope.rowItems[0].material_price == null || $scope.indentdetails == 'undefined' || $scope.indentdetails == null) {
                    notificationService.displayError("please enter the material");
                }
                else {
                    $scope.indentdetails.push({
                        'tenant_id': $rootScope.tenant.tenant_id,
                        'project_id': $scope.indent.project_id,
                        'SubContractor_id': $scope.indent.SubContractor_id,
                        'indent_no': $scope.indent.indent_no,
                        'material_name': $scope.rowItems[i].material_name,
                        'material_description': $scope.rowItems[i].material_description,
                        'quantity': $scope.rowItems[i].quantity,
                        'unit_of_measurement': $scope.rowItems[i].unit_of_measurement,
                        'material_price': $scope.rowItems[i].material_price,
                        'total_price': ($scope.rowItems[i].quantity * $scope.rowItems[i].material_price),
                        'given_quantity':0,
                        'material_released_status': false,
                        'released_material_Cost': 0,
                        'material_released_date': '01-01-2017',
                    });
                }

            }
            if ($scope.indentfile != null) {
                $scope.indentlist.indent_encode = $scope.indentfile.base64;
                $scope.indentlist.indent_encode_file_type = $scope.indentfile.filetype;
            }
           

            if ($scope.newIndentForm.$valid) {
                if ($scope.rowItems[0].material_name == 'undefined' || $scope.rowItems[0].material_name == null || $scope.rowItems[0].material_description == 'undefined' || $scope.rowItems[0].material_description == null || $scope.rowItems[0].quantity == 'undefined' || $scope.rowItems[0].quantity == null || $scope.rowItems[0].unit_of_measurement == 'undefined' || $scope.rowItems[0].unit_of_measurement == null || $scope.rowItems[0].material_price == 'undefined' || $scope.rowItems[0].material_price == null || $scope.indentdetails == 'undefined' || $scope.indentdetails == null) {
                    notificationService.displayError('Please enter material');
                }
                else {
                    apiService.post('api/indent/SaveIndent', $scope.indentlist, SaveIndentSucceess, SaveIndentFailed);
                }
            }
            else {
                notificationService.displayError('please enter mandatory fileds');
            }
        };

        function SaveIndentSucceess(response) {
            notificationService.displaySuccess('Indent saved successfully');
            $scope.showIndentForm = false;
            $scope.addind = true;
            $scope.indent.indent_no = '';
            $scope.indent.project_id = '';
            $scope.indent.SubContractor_id = '';
            $scope.indent.authorized_by = '';
            $scope.indent.recieved_by = '';
            $scope.indent.date_required = '';
            $scope.indent.date_recieved = '';
            $scope.indent.recieved_from = '';
            $scope.indentfile = '';
            $scope.newIndentForm.$setPristine();
            $scope.newIndentForm.$setUntouched();
            $scope.rows = { items: [{}] };
            $scope.indentdetails = [];
            $scope.indentlist = [];
            GetIndentdetails();
            Getindentlist();
        }
        function SaveIndentFailed() {
            notificationService.displayError('Indent Saved failed');
            $scope.indentdetails = [];
        }
        
        $scope.nrows = [];
        $scope.total_amount = function () {

            var total = 0;
            $scope.rows.items.forEach(function (row) {
                total += row.amount;
            })

            return total;
        }

        //$scope.getMaterialDetails = function (item) {

        //    angular.forEach($scope.MaterialList, function (p) {
        //        if (p.material_name == item.material_name) {
        //            item.material_description = p.material_description;
        //            item.unit_of_measurement = p.unit_of_measurement;
        //            item.material_price = p.material_price;
        //            item.UOMID = p.UOMID;
        //        }

        //    })

        //}

        $scope.getUnitName = function (unit_id) {
            for (var i = 0; i < $scope.Refmaster.length; i++) {
                if ($scope.Refmaster[i].id == unit_id) {
                    return $scope.Refmaster[i].reference_value;
                }
            }
        };
        $scope.getname = function (unit_id) {
            for (var i = 0; i < $scope.Refmaster.length; i++) {
                if ($scope.Refmaster[i].id == unit_id) {
                    return $scope.Refmaster[i].reference_value;
                }
            }
        };
        $scope.checkindentNoDup = function (prjid,indno) {
            for (var i = 0; i < $scope.GetIndentlist.length; i++) {
                if ($scope.GetIndentlist[i].project_id == prjid) {
                        if ($scope.GetIndentlist[i].indent_no == indno) {
                            notificationService.displayError("IndentNo already given please enter new one");
                            $scope.indent.indent_no = '';
                            document.getElementById('IndNo').focus();
                        }
                    }
                 }
            };

        $scope.showDetails = function (indent) {
            if ($scope.active != indent) {
                $scope.active = indent;
            }
            else {
                $scope.active = null;
            }
        };

        $scope.maxDate = new Date();
        var myDate = new Date();
        $scope.minDate = new Date(
            myDate.getFullYear(),
            myDate.getMonth()-1,
            myDate.getDate()
        );
        $scope.minDate1 = $scope.maxDate;
        $scope.maxDate1 = new Date(
            myDate.getFullYear(),
            myDate.getMonth() + 1,
            myDate.getDate()
        );

        $scope.checkindmat = function (item, index, projectid, subid, indno) {
            angular.forEach($scope.MaterialList, function (p) {
                if (p.material_name == item.material_name) {
                    item.material_description = p.material_description;
                    item.unit_of_measurement = p.unit_of_measurement;
                    item.material_price = p.material_price;
                    item.UOMID = p.UOMID;
                }
            })
            var checkfieldworkname = '';
            if ($scope.GetIndentdetailslist.length) {
                for (var i = 0; i < $scope.GetIndentdetailslist.length; i++) {
                    if ($scope.GetIndentdetailslist[i].projectid == projectid && $scope.GetIndentdetailslist[i].subcontractor_id == sub_id && $scope.GetIndentdetailslist[i].indent_no == indno && $scope.GetIndentdetailslist[i].material_name == item.material_name) {
                        checkfieldworkname = 'isDup';
                        break;
                    }
                }
            }
            var arrayCount = 0;
            if ($scope.rows.items.length > 1) {
                for (var i = 0; i < $scope.rows.items.length; i++) {
                    if (index != i) {
                        if ($scope.rows.items[i].material_name == item.material_name) {
                            arrayCount++;
                        }
                    }
                }
            }
            if (arrayCount > 0 || checkfieldworkname == 'isDup') {
                notificationService.displayError("material is already exits!");
                $scope.rows.items[index].material_name = '';
            }
        }
    }
})(angular.module('common.core'));