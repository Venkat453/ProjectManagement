(function (app) {
    'use strict';

    app.controller('policestationsCtrl', policestationsCtrl);

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

    policestationsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location'];

    function policestationsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location) {
        $rootScope.Loadsaveuserlog();
       
        $scope.policestation = {};
        $scope.Policestationlist = [];
        $scope.projectslists = [];
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


        LoadPolicestationsList();
        function LoadPolicestationsList() {
            apiService.get('api/policestation/getPoliceStationList/' + $rootScope.tenant.tenant_id, null, policestationslistloadcomplete, policestationslistloadfailed);
        };
        function policestationslistloadcomplete(response) {
            $scope.Policestationlist = response.data;
            if ($scope.Policestationlist.length == 0) {
                $scope.showPSForm = true;
                $scope.addpsbtn = false;
                $scope.clearbtn = true;
                $scope.addBtn = true;
                $scope.hidebtn = false;
                $scope.updateBtn = false;
               
            }
            else {
                $scope.showPSForm = false;
                $scope.addBtn = true;
                $scope.clearbtn = false;
                $scope.hidebtn = true;
                $scope.updateBtn = false;
                $scope.addpsbtn = true;
            }

        }
        function policestationslistloadfailed() {
            notificationservice.displayerror('fetching policestations list failed');

        }
     
        $scope.showAddform = function () {
            if ($scope.showPSForm == false) {
                $scope.showPSForm = true;
                $scope.policestation = {};
                $scope.readOnlyStatus = false;
                $scope.hidebtn = true;
                $scope.addBtn = true;
                $scope.updateBtn = false;
                $scope.addpsbtn = false;
                $scope.project_id = '';
                $scope.newPoliceStationForm.$setPristine();
                $scope.newPoliceStationForm.$setUntouched();

            }
            else {
                $scope.showPSForm = false;
                $scope.addpsbtn = true;
            }
        };


        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.policestation = {};
            $scope.newPoliceStationForm.$setPristine();
            $scope.newPoliceStationForm.$setUntouched();
            $scope.policestation.project_id = '';

        }
        $scope.hideUserForm = function () {
            $scope.showAddform();
            $scope.newPoliceStationForm.$setPristine();
            $scope.newPoliceStationForm.$setUntouched();
        }
        ///for clear and cancel buttons///



        ///sort/////
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        /////sort///


       


       //saving psdata/////
        $scope.addPoliceStation = function () {
            $scope.policestation.tenant_id = $rootScope.tenant.tenant_id;
            $scope.status = 'original';
            // apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + $scope.policestation.project_id, null, PSListLoadComplete, PSListLoadFailed);
            if ($scope.newPoliceStationForm.$valid){
                if ($scope.Policestationlist.length) {
                    for (var i = 0; i < $scope.Policestationlist.length; i++) {
                        if ($scope.Policestationlist[i].project_id == $scope.policestation.project_id) {
                                if ($scope.Policestationlist[i].ps_name == $scope.policestation.ps_name) {
                                    notificationService.displayError("We have already exist this policestation.So please enter another policestation");
                                    $scope.status = 'duplicate';
                                    $scope.policestation.ps_name = '';
                                    document.getElementById('ps_name').focus();
                                }
                            }
                    }
                    
                    if ($scope.status != 'duplicate') {
                        apiService.post('api/PoliceStation/SavePoliceStation', $scope.policestation, savePoliceStationSucceess, savePoliceStationFailed);
                        $scope.status = 'original';
                    }
                }
                else {
                    apiService.post('api/PoliceStation/SavePoliceStation', $scope.policestation, savePoliceStationSucceess, savePoliceStationFailed);
                    $scope.status = 'original';
                }
                
            }
            else { notificationService.displayError('Enter mandatory details'); }
        };
        function savePoliceStationSucceess() {
            $scope.showPSForm = false;
            notificationService.displaySuccess('PoliceStation Details Saved Successfully');
            $scope.policestation = {};
            $scope.policestation.project_id = '';
            $scope.newPoliceStationForm.$setPristine();
            $scope.newPoliceStationForm.$setUntouched();
            $scope.addpsbtn = true;
            LoadPolicestationsList();
           
            
        }
        function savePoliceStationFailed() {
            notificationService.displayError('PoliceStation Details Saving Failed');
        }
        //saving psdata////

        ///viewmode/////
        $scope.readOnlyStatus = false;
        $scope.ViewDetails = function (ps) {
            $scope.policestation = {};
            $scope.addBtn = false;
            $scope.updateBtn = false;
            $scope.addpsbtn = false;
            $scope.hidebtn = true;
            $scope.clearbtn = false;
            $scope.readOnlyStatus = true;
            $scope.showPSForm = true;
            $scope.policestation.ps_name = ps.ps_name;
            $scope.policestation.ps_contact_person = ps.ps_contact_person;
            $scope.policestation.contact_person_mobile_no = ps.contact_person_mobile_no;
            $scope.policestation.project_id = ps.project_id;
        };
        ///Viewmode////


        ///edit mode///
        //$scope.addBtn = true;
        //$scope.updateBtn = false;
        $scope.EditPs = function (ps) {
            $scope.policestation = {};
            $scope.showPSForm = true;
            $scope.addBtn = false;
            $scope.updateBtn = true;
            $scope.addpsbtn = false;
            $scope.readOnlyStatus = false;
            $scope.policestation = ps;
        };
        /////edit mode//


        ///updateps/////
        $scope.UpdatePS = function () {
            $scope.policestation.modified_by = $rootScope.tenant.tenant_id;
            if ($scope.newPoliceStationForm.$valid) {
                apiService.post('api/PoliceStation/UpdatePolicestation', $scope.policestation, updatePoliceStationSucceess, updatePoliceStationFailed);
            }
            else {
                notificationService.displayError("please fill mandatory fields");
            }
        };
        function updatePoliceStationSucceess() {
            notificationService.displaySuccess("Data Updated Successfully");
            $scope.policestation = {};
            $scope.showPSForm = false;
            $scope.addBtn = false;
            $scope.updateBtn = false;
            $scope.addpsbtn = true;
            $scope.clearbtn = false;
            $scope.hidebtn = false;
           

            
            //GetPoliceStationByPrjtId();
        }
        function updatePoliceStationFailed() {
            notificationService.displayError("Updating data failed");
        }
        ///updateps/////
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


        //$scope.GetPoliceStationByPrjtId = function (prjctid) {
        //    for (var i = 0; i < $scope.Policestationlist.length; i++) {
        //        if ($scope.Policestationlist[i].project_id = prjctid) {
        //            return $scope.Policestationlist;
        //            $scope.showdata = true;
        //        }
        //        else {
        //            $scope.showdata = false;
        //        }
               
        //    }
        //}
        //$scope.GetPoliceStationByPrjtId = function (project_id) {
        //    apiService.get('api/PoliceStation/getPoliceStationListByProjId/' + project_id, null, PoliceStationsListLoadComplete, PoliceStationsListLoadFailed);
        //};
        //function PoliceStationsListLoadComplete(response) {
        //    $scope.Policestationlist = response.data;
        //    $scope.showdiv = true;
        //}
        //function PoliceStationsListLoadFailed() {
        //    notificationService.displayError('fetching policestations list failed');
        //    $scope.showdiv = false;
        //    return No records exist under this project..;
        //}
        
        function PSListLoadComplete(response) {
            $scope.PSList = response.data;
            $scope.showdiv = true;
        }
        function PSListLoadFailed() {
            notificationService.displayError('fetching policestations list failed');
            $scope.showdiv = false;
        }
        $scope.getprojectname = function (prjctid) {
            for (var i = 0; i < $scope.projectslists.length; i++) {
                if ($scope.projectslists[i].id == prjctid) {
                    return $scope.projectslists[i].project_name;
                }
            }
        }
        $scope.checkpsname = function (id, name) {
            for (var i = 0; i < $scope.Policestationlist.length; i++) {
                if ($scope.Policestationlist[i].project_id == id) {
                    if ($scope.Policestationlist[i].ps_name === name) {
                        notificationService.displayError("ps already given to this project enter new one");
                        $scope.policestation.ps_name = '';
                        document.getElementById('ps_name').focus();
                    }
                }
            }
        }
    }

})(angular.module('common.core'));