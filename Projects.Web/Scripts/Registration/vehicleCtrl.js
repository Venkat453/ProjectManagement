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
    app.directive('allowPattern', function () {
        return {
            restrict: "A",
            compile: function (tElement, tAttrs) {
                return function (scope, element, attrs) {
                    element.bind("keypress", function (event) {
                        var keyCode = event.which || event.keyCode;
                        var keyCodeChar = String.fromCharCode(keyCode);
                        if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                            event.preventDefault();
                            return false;
                        }
                    });
                };
            }
        };
    });
    app.controller('vehicleCtrl', vehicleCtrl);

    vehicleCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal'];


    function vehicleCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal) {

        $rootScope.Loadsaveuserlog();
        $scope.LaboursList = [];
        $scope.states1 = [];
        $scope.cities1 = [];
        $scope.states2 = [];
        $scope.cities2 = [];
        $scope.states3 = [];
        $scope.cities3 = [];
        $scope.CountriesList = $rootScope.CountriesList;
        $scope.StatesList = $rootScope.StatesList;
        $scope.CitiesList = $rootScope.CitiesList;
        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.vehicleslists = [];
        $scope.vehicles = {};
        $scope.pollutions = [];
        $scope.projectslists = [];
        $scope.isEditable = true;
        $scope.sublist = [];
        $scope.minDate = new Date();

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


        loadform();
        function loadform() {
            if ($scope.vehicleslists == 0) {
                $scope.showVHForm = true;
            }
            else {
                $scope.showVHForm = false;
            }

        }
        var photocount = 0;
        $('#d_file').change(function (event) {
            var filesSelected = document.getElementById("d_file").files;
            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
                    $scope.tenantlogofiletype = filesSelected[0].type;
                    if (filesSelected[0].type == "image/jpeg") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/jpeg;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "image/png") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/png;base64,/g, '');

                    }
                    else {
                        notificationService.displayError("Please Upload JPG or PNG Files!");
                        return false;
                    }

                }
                fileReader.readAsDataURL(fileToLoad);
            }
            $("#imgdriverlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));
            photocount++;
        });
        $("#imgdriverlogo").click(function () {
            $("#d_file").trigger("click");
        });


        var fitcount = 0;
        $('#f_file').change(function (event) {
            var filesSelected = document.getElementById("f_file").files;
            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
                    $scope.tenantlogofiletype = filesSelected[0].type;
                    if (filesSelected[0].type == "image/jpeg") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/jpeg;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "image/png") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/png;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "application/pdf") {
                        $scope.tenantlogoencoded = srcData.replace(/data:application\/pdf;base64,/g, '');

                    }
                    else {
                        notificationService.displayError("Please Upload JPG or PNG Files!");
                        return false;
                    }

                }
                fileReader.readAsDataURL(fileToLoad);
            }
            fitcount++;
        });
        var polcount = 0;
        $('#p_file').change(function (event) {
            var filesSelected = document.getElementById("p_file").files;
            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
                    $scope.tenantlogofiletype = filesSelected[0].type;
                    if (filesSelected[0].type == "image/jpeg") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/jpeg;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "image/png") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/png;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "application/pdf") {
                        $scope.tenantlogoencoded = srcData.replace(/data:application\/pdf;base64,/g, '');

                    }
                    else {
                        notificationService.displayError("Please Upload JPG or PNG Files!");
                        return false;
                    }

                }
                fileReader.readAsDataURL(fileToLoad);
            }
            polcount++;
        });
        var inscount = 0;
        $('#i_file').change(function (event) {
            var filesSelected = document.getElementById("i_file").files;
            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
                    $scope.tenantlogofiletype = filesSelected[0].type;
                    if (filesSelected[0].type == "image/jpeg") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/jpeg;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "image/png") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/png;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "application/pdf") {
                        $scope.tenantlogoencoded = srcData.replace(/data:application\/pdf;base64,/g, '');

                    }
                    else {
                        notificationService.displayError("Please Upload JPG or PNG Files!");
                        return false;
                    }

                }
                fileReader.readAsDataURL(fileToLoad);
            }
            inscount++;
        });
        var drvliccount = 0;
        $('#drv_file').change(function (event) {
            var filesSelected = document.getElementById("drv_file").files;
            if (filesSelected.length > 0) {
                $scope.filetype = filesSelected[0].type;
                $scope.filename = filesSelected[0].name;
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var srcData = fileLoadedEvent.target.result;
                    $scope.tenantlogofiletype = filesSelected[0].type;
                    if (filesSelected[0].type == "image/jpeg") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/jpeg;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "image/png") {
                        $scope.tenantlogoencoded = srcData.replace(/data:image\/png;base64,/g, '');

                    }
                    else if (filesSelected[0].type == "application/pdf") {
                        $scope.tenantlogoencoded = srcData.replace(/data:application\/pdf;base64,/g, '');

                    }
                    else {
                        notificationService.displayError("Please Upload JPG or PNG Files!");
                        return false;
                    }

                }
                fileReader.readAsDataURL(fileToLoad);
            }
            drvliccount++;
        });


        GetDriverImage();
        function GetDriverImage() {
            if ($scope.driverlogo != null && $scope.driverlogo != '') {
                $scope.driverlogo = $scope.getImage($scope.driverlogo);
            }
            else {
                $scope.driverlogo = "Content/images/Common/emp_photo.jpg";
            }
        }

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
        }
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        LoadProjectsList();
        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $scope.projectslists = response.data;
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('Fetching GetProjectsList Failed');
        }

        function SubContractorsListLoadComplete(response) {
            $rootScope.SCList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('fetching subcontractorslist failed');
        }

        $scope.getsubcont = function (project) {
            $scope.sublist = ($filter('filter')($scope.SCList, { project_id: project }, true));
        }
        $scope.getCountryStates1 = function (country) {
            $scope.states1 = ($filter('filter')($scope.StatesList, { country_id: country }, true));
        };

        $scope.getStateCities1 = function (state) {
            $scope.cities1 = ($filter('filter')($scope.CitiesList, { state_id: state }, true));
        }
        $scope.getCountryStates2 = function (country) {
            $scope.states2 = ($filter('filter')($scope.StatesList, { country_id: country }, true));
        };

        $scope.getStateCities2 = function (state) {
            $scope.cities2 = ($filter('filter')($scope.CitiesList, { state_id: state }, true));
        }
        $scope.getCountryStates3 = function (country) {
            $scope.states3 = ($filter('filter')($scope.StatesList, { country_id: country }, true));
        };

        $scope.getStateCities3 = function (state) {
            $scope.cities3 = ($filter('filter')($scope.CitiesList, { state_id: state }, true));
        }



        $scope.clearbtn = true;
        $scope.hidebtn = false;
        $scope.addveh = true;
        $scope.showVHForm = false;
        $scope.showAddform = function () {
            if ($scope.showVHForm == false) {
                $scope.vehicles = {};
                $scope.pollution_validdate = '';
                $scope.insurence_validdate = '';
                $scope.fitness_validdate = '';
                $scope.driver_lic_validdate = '';
                $scope.driverlogo = "Content/images/Common/emp_photo.jpg";
                $scope.showVHForm = true;
                $scope.readOnlyStatus = false;
                $scope.addBtn = true;
                $scope.updateBtn = false;
                $scope.isEditable = true;
                $scope.namefile = false;
                $scope.addveh = false;
                $scope.hidebtn = true;
                $scope.clearbtn = false;
                $scope.driver_photo = '';
            }
            else {
                $scope.showVHForm = false;
                $scope.addveh = true;
            }
        };

        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.vehicles = {};
            $scope.newVehicleForm.$setPristine();
            $scope.newVehicleForm.$setUntouched();
            $scope.pollution_file = '';
            $scope.insurence_file = '';
            $scope.fitness_validdate = '';
            $scope.drilic_file = '';
            
        }
        $scope.hideUserForm = function () {
            $scope.showVHForm = false;
            $scope.addlabour = true;
            $scope.showAddform();
        }
        ///for clear and cancel buttons///
        $scope.showRealtion = function (relationId) {
            var selected = $filter('filter')($scope.ReferenceMasterData, { id: relationId });
            return (relationId && selected.length) ? selected[0].reference_value : 'Not set';
        };

        $scope.addvehicle = function () {
            $scope.vehicles.driver_aadharnumber = $scope.vehicles.driver_aadharnumber
            if ($scope.driver_photo != null) {
                $scope.vehicles.driver_filename = $scope.driver_photo.filename;
                $scope.vehicles.driver_photo = $scope.driver_photo.base64;
                $scope.vehicles.driver_photo_file_type = $scope.driver_photo.filetype;
            }
            $scope.vehicles.tenant_id = $scope.tenantID;
            $scope.vehicles.pollution_validdate = $scope.pollution_validdate;
            if ($scope.pollution_file != null) {
                $scope.vehicles.pollution_filename = $scope.pollution_file.filename;
                $scope.vehicles.pollutionimage = $scope.pollution_file.base64;
                $scope.vehicles.pollutionimage_filetype = $scope.pollution_file.filetype;
            }

            $scope.vehicles.insurence_validdate = $scope.insurence_validdate;
            if ($scope.insurence_file != null) {
                $scope.vehicles.insurence_filename = $scope.insurence_file.filename;
                $scope.vehicles.insurenceimage = $scope.insurence_file.base64;
                $scope.vehicles.insurenceimage_filetype = $scope.insurence_file.filetype;
            }

            $scope.vehicles.fitness_validdate = $scope.fitness_validdate;
            if ($scope.fitness_file != null) {
                $scope.vehicles.fitness_filename = $scope.fitness_file.filename;
                $scope.vehicles.fitnessimage = $scope.fitness_file.base64;
                $scope.vehicles.fitnessimage_filetype = $scope.fitness_file.filetype;
            }

            $scope.vehicles.driver_lic_validdate = $scope.driver_lic_validdate;
            if ($scope.drilic_file != null) {
                $scope.vehicles.driver_lic_filename = $scope.drilic_file.filename;
                $scope.vehicles.driverlicimage = $scope.drilic_file.base64;
                $scope.vehicles.driverlicimage_filetype = $scope.drilic_file.filetype;
            }
            if ($scope.vehicles.pollution_clearance == false) {
                $scope.vehicles.pollution_clearance = $scope.pollution_clearance;
            }
            if ($scope.vehicles.insurence_clearance == false) {
                $scope.vehicles.insurence_clearance = $scope.insurence_clearance;
            }
            if ($scope.vehicles.fitness_clearance == false) {
                $scope.vehicles.fitness_clearance = $scope.fitness_clearance;
            }
            if ($scope.pollution_validdate == null) {
                $scope.vehicles.pollution_validdate = "2017-01-01";
            }

            if ($scope.insurence_validdate == null) {
                $scope.vehicles.insurence_validdate = "2017-01-01";
            }
            if ($scope.driver_lic_validdate == null) {
                $scope.vehicles.driver_lic_validdate = "2017-01-01";
            }
            if ($scope.fitness_validdate == null) {
                $scope.vehicles.fitness_validdate = "2017-01-01";
            }

            if ($scope.newVehicleForm.$valid) {
                if ($scope.vehicleslists != 0) {
                    for (var i = 0; i < $scope.vehicleslists.length; i++) {
                        if ($scope.vehicleslists[i].vehicle_reg_no == $scope.vehicles.vehicle_reg_no) {
                            notificationService.displayError("vehicle reg_no already exists enter another one");
                            $scope.vehicles.vehicle_reg_no = '';
                            document.getElementById('vehregiNmbr').focus();
                            break;

                        }
                        else if ($scope.vehicleslists[i].driver_lic_no == $scope.vehicles.driver_lic_no) {
                            notificationService.displayError("driver lic no already exists enter another one");
                            $scope.vehicles.driver_lic_no = '';
                            document.getElementById('driverlicNmbr').focus();
                            break;
                        }
                        else {
                            apiService.post('api/Vehicle/Savevehicle', $scope.vehicles, savevehicleSucceess, savevehicleFailed);
                            break;
                        }
                    }

                }
                else {
                    apiService.post('api/Vehicle/Savevehicle', $scope.vehicles, savevehicleSucceess, savevehicleFailed);
                }
            }
            else {
                notificationService.displayError("please enter mandatory details");
            }
        };

        function savevehicleSucceess() {
            notificationService.displaySuccess('Vehicle data saved succeessfull');
            GetVehiclesListt();
            $scope.showVHForm = false;
            $scope.vehicles = {};
            $scope.newVehicleForm.$setPristine();
            $scope.newVehicleForm.$setUntouched();
            $scope.pollution_validdate = '';
            $scope.insurence_validdate = '';
            $scope.fitness_validdate = '';
            $scope.driver_lic_validdate = '';
            $scope.pollution_file = ''
            $scope.insurence_file = '';
            $scope.fitness_file = '';
            $scope.drilic_file = '';
            $scope.driver_photo = '';
            $scope.addveh = true;
        }
        function savevehicleFailed() {
            notificationService.displayError('savind data failed');
        }


        GetVehiclesListt();
        function GetVehiclesListt() {
            apiService.get('api/Vehicle/GetVehiclesList/' + $rootScope.tenant.tenant_id, null, vehicleListLoadComplete, vehicleListLoadFailed);
        }
        function vehicleListLoadComplete(response) {
            $scope.vehicleslists = response.data;

            /////for getting city name in grid////
            for (var i = 0; i < $scope.CitiesList.length; i++) {
                for (var j = 0; j < $scope.vehicleslists.length; j++) {
                    if ($scope.CitiesList[i].id == $scope.vehicleslists[j].current_city) {
                        $scope.vehicleslists[j].currentcity = $scope.CitiesList[i].city_name;

                    }
                }
            }
            /////for getting city name in grid////

            ///getting subcontractor name//////
            for (var i = 0; i < $scope.SCList.length; i++) {
                for (var j = 0; j < $scope.vehicleslists.length; j++) {
                    if ($scope.SCList[i].id == $scope.vehicleslists[j].subcontractor_id) {
                        $scope.vehicleslists[j].subcontractorname = $scope.SCList[i].subcontractor_name;
                    }
                }
            }
            ///getting subcontractor name//////

            //////for geetting project name///////

            for (var i = 0; i < $scope.projectslists.length; i++) {
                for (var j = 0; j < $scope.vehicleslists.length; j++) {
                    if ($scope.projectslists[i].id == $scope.vehicleslists[j].project_id) {
                        $scope.vehicleslists[j].projectname = $scope.projectslists[i].project_name;
                    }
                }
            }
            //////for geetting project name///////

            /////for getting vehicle type/////
            for (var i = 0; i < $scope.Refmaster.length; i++) {
                for (var j = 0; j < $scope.vehicleslists.length; j++) {
                    if ($scope.Refmaster[i].id == $scope.vehicleslists[j].vehicle_type) {
                        $scope.vehicleslists[j].vehiclename = $scope.Refmaster[i].reference_value;

                    }
                }
            }
            ///////for getting vehicle type/////
        }
        function vehicleListLoadFailed() {
            notificationService.displayError('fetching vehiclelist failed');
        }

        ////get images////
        $scope.getImage = function (data) {
            return 'data:' + $scope.vehicles.driver_photo_file_type + ';base64,' + data;
        }

        $scope.getimageforedit = function (data) {

            return 'data:' + $scope.vehicles.driver_photo_file_type + ';base64,' + data;
        }
        //////get images//////

        $scope.readOnlyStatus = false;
        $scope.ViewDetails = function (vh) {
            $scope.addBtn = false;
            $scope.updateBtn = false;
            $scope.readOnlyStatus = true;
            $scope.showVHForm = true;
            $scope.vehicles = vh;
            $scope.isEditable = false;
            $scope.vehicles.driver_contact_no =  (vh.driver_contact_no);
            $scope.vehicles.driver_aadharnumber = (vh.driver_aadharnumber);
            $scope.vehicles.contact_person_contact_number = (vh.contact_person_contact_number);
            $scope.vehicles.current_zip = parseInt(vh.current_zip);
            $scope.vehicles.permanent_zip = parseInt(vh.permanent_zip);

            $scope.pollution_validdate = new Date(vh.pollution_validdate);
            $scope.insurence_validdate = new Date(vh.insurence_validdate);
            $scope.fitness_validdate = new Date(vh.fitness_validdate);
            $scope.driver_lic_validdate = new Date(vh.driver_lic_validdate);
            $scope.vehicles.driver_photo_file_type = vh.driver_photo_file_type;
            $scope.vehicles.fitnessimage = vh.fitness_file;
            $scope.vehicles.fitnessimage_filetype = vh.fitnessimage_filetype;
            $scope.vehicles.insurence_file = vh.insurence_file;
            $scope.vehicles.pollution_file = vh.pollution_file;
            $scope.getCountryStates1($scope.vehicles.current_country);
            $scope.getStateCities1($scope.vehicles.current_state);

            $scope.getCountryStates2($scope.vehicles.permanent_country);
            $scope.getStateCities2($scope.vehicles.permanent_state);

            $scope.getCountryStates3($scope.vehicles.contact_person_country);
            $scope.getStateCities3($scope.vehicles.contact_person_state);

            $scope.driver_photo = $scope.getImage(vh.driver_photo);
            if ($scope.driver_photo) {
                $scope.driverlogo = $scope.getImage(vh.driver_photo);
            }
            else {
                $scope.driverlogo = "Content/images/Common/emp_photo.jpg";
            }
        };



        $scope.addBtn = true;
        $scope.updateBtn = false;
        $scope.EditVehicle = function (vh) {
            $scope.addBtn = false;
            $scope.updateBtn = true;
            $scope.readOnlyStatus = false;
            $scope.hidebtn = true;
            $scope.clearbtn = false;
            $scope.showVHForm = true;
            $scope.vehicles = vh;
            $scope.isEditable = true;
            $scope.namefile = true;
            $scope.pollution_validdate = new Date(vh.pollution_validdate);
            $scope.insurence_validdate = new Date(vh.insurence_validdate);
            $scope.fitness_validdate = new Date(vh.fitness_validdate);
            $scope.driver_lic_validdate = new Date(vh.driver_lic_validdate);
            $scope.vehicles.driver_photo_file_type = vh.driver_photo_file_type;
            $scope.driver_photo = $scope.getImage(vh.driver_photo);
            if ($scope.driver_photo) {
                $scope.driverlogo = $scope.getImage(vh.driver_photo);
            }
            else {
                $scope.driverlogo = "Content/images/Common/emp_photo.jpg";
            }
            $scope.getCountryStates1($scope.vehicles.current_country);
            $scope.getStateCities1($scope.vehicles.current_state);

            $scope.getCountryStates2($scope.vehicles.permanent_country);
            $scope.getStateCities2($scope.vehicles.permanent_state);

            $scope.getCountryStates3($scope.vehicles.contact_person_country);
            $scope.getStateCities3($scope.vehicles.contact_person_state);

            $scope.vehicles.driver_contact_no = vh.driver_contact_no;
            $scope.vehicles.driver_aadharnumber = vh.driver_aadharnumber;
            $scope.vehicles.contact_person_contact_number = vh.contact_person_contact_number;
            $scope.vehicles.current_zip = parseInt(vh.current_zip);
            $scope.vehicles.permanent_zip = parseInt(vh.permanent_zip);

            $scope.drilicnce_file = $scope.vehicles.driver_lic_filename.substring(0, 30);
            $scope.fitn_file = $scope.vehicles.fitness_filename.substring(0, 30);
            $scope.insu_file = $scope.vehicles.insurence_filename.substring(0, 30);
            $scope.pollu_file = $scope.vehicles.pollution_filename.substring(0, 30);

        };

        $scope.downLoadImage1 = function () {
            var a = document.createElement('a');
            var filetype = $scope.vehicles.driverlicimage_filetype;
            var data = $scope.vehicles.driverlicimage;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'driverlicimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'driverlicForm.pdf';
                a.click();
            }
        }
        $scope.downLoadImage2 = function () {
            var a = document.createElement('a');
            var filetype = $scope.vehicles.pollutionimage_filetype;
            var data = $scope.vehicles.pollutionimage;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'pollutionimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'pollutionForm.pdf';
                a.click();
            }
        }
        $scope.downLoadImage3 = function () {
            var a = document.createElement('a');
            var filetype = $scope.vehicles.insurenceimage_filetype;
            var data = $scope.vehicles.insurenceimage;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'insurenceimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'insurenceForm.pdf';
                a.click();
            }
        }
        $scope.downLoadImage4 = function () {
            var a = document.createElement('a');
            var filetype = $scope.vehicles.fitnessimage_filetype;
            var data = $scope.vehicles.fitnessimage;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'fitnessimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'fitnessForm.pdf';
                a.click();
            }
        }
        //$scope.vehicles = [];
        $scope.UpdateVehicle = function () {
            $scope.vehicles.modified_by = $rootScope.tenant.tenant_id;
            $scope.vehicles.driver_aadharnumber = $scope.vehicles.driver_aadharnumber;
            $scope.vehicles.pollution_validdate = $scope.pollution_validdate;

            if (photocount > 0) {
                $scope.vehicles.driver_filename = $scope.driver_photo.filename;
                $scope.vehicles.driver_photo = $scope.driver_photo.base64;
                $scope.vehicles.driver_photo_file_type = $scope.driver_photo.filetype;
            }
            if (fitcount > 0) {
                $scope.vehicles.fitness_filename = $scope.fitness_file.filename;
                $scope.vehicles.fitnessimage = $scope.fitness_file.base64;
                $scope.vehicles.fitnessimage_filetype = $scope.fitness_file.filetype;
            }
            if (polcount > 0) {
                $scope.vehicles.pollution_filename = $scope.pollution_file.filename;
                $scope.vehicles.pollutionimage = $scope.pollution_file.base64;
                $scope.vehicles.pollutionimage_filetype = $scope.pollution_file.filetype;
            }
            if (inscount > 0) {
                $scope.vehicles.insurence_filename = $scope.insurence_file.filename;
                $scope.vehicles.insurenceimage = $scope.insurence_file.base64;
                $scope.vehicles.insurenceimage_filetype = $scope.insurence_file.filetype;
            }
            if (drvliccount > 0) {
                $scope.vehicles.driver_lic_filename = $scope.drilic_file.filename;
                $scope.vehicles.driverlicimage = $scope.drilic_file.base64;
                $scope.vehicles.driverlicimage_filetype = $scope.drilic_file.filetype;
            }
            if ($scope.newVehicleForm.$valid) {
                apiService.post('api/Vehicle/UpdateVehicles', $scope.vehicles, updateVehiclesSucceess, updateVehiclesFailed);
            }

            else {
                notificationService.displayError("Please enter mandatory fields");
            }
            //$scope.isEditable = true;
        };
        function updateVehiclesSucceess() {
            notificationService.displaySuccess("Data Updated Successfully");
            $scope.vehicles = {};
            $scope.newVehicleForm.$setPristine();
            $scope.newVehicleForm.$setUntouched();
            $scope.showVHForm = false;
            $scope.addBtn = true;
            $scope.updateBtn = false;
            GetVehiclesListt();
            photocount = 0;
            fitcount = 0;
            inscount = 0;
            polcount = 0;
            $scope.pollution_file = '';
            $scope.fitness_file = '';
            $scope.insurence_file = '';
            $scope.drilic_file = '';
            drvliccount = 0;
            $scope.addveh = true;

        }
        function updateVehiclesFailed() {
            notificationService.displayError("Updating data failed");
        }

        ////open popup for poolution//
        $scope.Viewpollutiondetails = Viewpollutiondetails;
        function Viewpollutiondetails(vehicle) {
            alert(vehicle.pollution_validdate);
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Registration/Viewpollutiondetails.html',
                controller: 'ViewpollutiondetailsCtrl',
                scope: $scope,
                resolve: {
                    vehicle: function () { return vehicle },
                }
            })
        }
        

        /////mouse hover/////
        $scope.showvehicleDetails = function (vehicle) {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Registration/Vehicleviewdetails.html',
                controller: 'VEhicleviewdetailsCtrl',
                resolve: {
                    vehicle: function () { return vehicle },
                }
            });
        }
        /////mouse hover////

        //$scope.search = function (row) {
        //    //return ((row.project_name.indexOf($scope.project || '') !== -1));
        //    $scope.result = row.vehicle_reg_no.indexOf($scope.newvehicles || '') !== -1;
        //    return $scope.result;
        //};

    }

})(angular.module('common.core'));