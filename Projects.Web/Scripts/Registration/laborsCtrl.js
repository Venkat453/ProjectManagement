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
    app.controller('laborsCtrl', laborsCtrl);

    laborsCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$filter', '$modal','$anchorScroll'];

    function laborsCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $filter, $modal, $anchorScroll) {

        $rootScope.Loadsaveuserlog();
        $scope.LaboursList = [];
        $scope.CountriesList = [];
        $scope.states = [];
        $scope.cities = [];
        $scope.Refmaster = $rootScope.ReferenceMasterData;
        $scope.labourlogo = '';
        $scope.labour = {};
        $scope.CountriesList = $rootScope.CountriesList;
        $scope.StatesList = $rootScope.StatesList;
        $scope.CitiesList = $rootScope.CitiesList;
        $scope.tenantID = $rootScope.tenant.tenant_id;
        $scope.projectslists = [];
        $scope.isEditable = true;
        $scope.sublist = [];
        $scope.addlabour = true;

        ////enable certain period in calendar///
        var myDate = new Date();
        $scope.minDate = new Date(
          myDate.getFullYear()-60,
          myDate.getMonth() ,
            myDate.getDate()
        );
        $scope.maxDate = new Date(
            myDate.getFullYear()-18,
            myDate.getMonth(),
            myDate.getDate()
        );
        ////enable certain period in calendar///

        //pagination- no. per page dropdown......
        $scope.page = {};
        $scope.page.levelsArr = [
            { value: "5", label: "Records Per Page" },
            { value: "10", label: "Records Per Page:10" },
            { value: "25", label: "Records Per Page:25" },
            { value: "50", label: "Records Per Page:50" },
            { value: "100", label: "Records Per Page:100" }
        ];
        $scope.page.levels = $scope.page.levelsArr[0].value;
        //end........

        loadform();
        function loadform() {
            if ($scope.LaboursList == 0) {
                $scope.showSBForm = true;
            }
            else {
                $scope.showSBForm = false;
            }

        }
        
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        $scope.clearbtn = true;
        $scope.hidebtn = false;
        $scope.showSBForm = false;
        $scope.showAddform = function () {
            if ($scope.showSBForm == false) {
                $scope.labour = {};
                // $scope.labourlogo = "Content/images/Common/emp_photo.jpg";
                $scope.readOnlyStatus = false;
                $scope.showSBForm = true;
                $scope.labourlogo = '';
                $scope.labour_photo = '';
                $scope.addBtn = true;
                $scope.updateBtn = false;
                $scope.field_readOnlyStatus = false;
                $scope.isEditable = true;
                $scope.namefile = false;
                $scope.addlabour = false;
                $scope.hidebtn = true;
                $scope.clearbtn = false;
                $scope.labour.aadhar = '';
                $scope.newLabourEnrollmentForm.$setPristine();
                $scope.newLabourEnrollmentForm.$setUntouched();
                
                
            }
            else {
                $scope.showSBForm = false;
                $scope.addlabour = true;
            }
        };
        ///for clear and cancel buttons////
        $scope.Clearform = function () {
            $scope.labour = {};
            $scope.newLabourEnrollmentForm.$setPristine();
            $scope.newLabourEnrollmentForm.$setUntouched();
            $scope.aadharfile = '';
            $scope.bankfile = '';
            $scope.medicalcertificatefile = '';
            $scope.eyecertificatefile = '';
            $scope.labour_photo = '';
        }
        $scope.hideUserForm = function () {
            $scope.showAddform();
            $scope.showSBForm = false;
            $scope.addlabour = true;
        }
        ///for clear and cancel buttons///

        $scope.limitKeypress = function ($event, value, maxLength) {
            if (value !== undefined && value.toString().length >= maxLength) {
                $event.preventDefault();
            }
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

        $scope.getCountryStates = function (country) {
            $scope.states = ($filter('filter')($scope.StatesList, { country_id: country }, true));
            $scope.cities = [];
        };

        $scope.getStateCities = function (state) {
            $scope.cities = ($filter('filter')($scope.CitiesList, { state_id: state }, true));
        }
        $scope.getCountryStates1 = function (country1) {
            $scope.states1 = ($filter('filter')($scope.StatesList, { country_id: country1 }, true));
            $scope.cities1 = [];
        };

        $scope.getStateCities1 = function (state1) {
            $scope.cities1 = ($filter('filter')($scope.CitiesList, { state_id: state1 }, true));
        }
        $scope.getCountryStates2 = function (country2) {
            $scope.states2 = ($filter('filter')($scope.StatesList, { country_id: country2 }, true));
            $scope.cities2 = [];
        };

        $scope.getStateCities2 = function (state2) {
            $scope.cities2 = ($filter('filter')($scope.CitiesList, { state_id: state2 }, true));
        }
        
        var lbrphotocount = 0;
        $('#l_file').change(function (event) {
            var filesSelected = document.getElementById("l_file").files;
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
            $("#imglabourlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));
            lbrphotocount++;
        });
        $("#imglabourlogo").click(function () {
            $("#l_file").trigger("click");
        });

        var aadharcount = 0;
        $('#a_file').change(function (event) {
            var filesSelected = document.getElementById("a_file").files;
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
                        notificationService.displayError("Please Upload JPG or PNG or PDF Files!");
                        return false;
                    }
                }
                fileReader.readAsDataURL(fileToLoad);
            }
            aadharcount++
        });
        var bankcount = 0;
        $('#b_file').change(function (event) {
            var filesSelected = document.getElementById("b_file").files;
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
                        notificationService.displayError("Please Upload JPG or PNG or PDF Files!");
                        return false;
                    }
                }
                fileReader.readAsDataURL(fileToLoad);
            }
            bankcount++;

        });
        var medcount = 0;
        $('#m_file').change(function (event) {
            var filesSelected = document.getElementById("m_file").files;
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
                        notificationService.displayError("Please Upload JPG or PNG or PDF Files!");
                        return false;
                    }
                }
                fileReader.readAsDataURL(fileToLoad);
            }
            medcount++;

        });
        var eyecount = 0;
        $('#e_file').change(function (event) {
            var filesSelected = document.getElementById("e_file").files;
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
                        notificationService.displayError("Please Upload JPG or PNG or PDF Files!");
                        return false;
                    }
                }
                fileReader.readAsDataURL(fileToLoad);
            }
            eyecount++;

        });
        GetLabourImage();
        function GetLabourImage() {
            if ($scope.labourlogo != null && $scope.labourlogo != '') {
                $scope.labourlogo = $scope.getImage($scope.labourlogo);
            }
            else {
                $scope.labourlogo = "Content/images/Common/emp_photo.jpg";
            }
        }

        $scope.SaveLabour = function () {
            if ($scope.labour_photo != null) {
                $scope.labour.labour_filename = $scope.labour_photo.filename;
                $scope.labour.labour_photo = $scope.labour_photo.base64;
                $scope.labour.labour_photo_file_type = $scope.labour_photo.filetype;
            }
            if ($scope.aadharfile != null) {
                $scope.labour.aadhar_filename = $scope.aadharfile.filename;
                $scope.labour.aadhar_encode = $scope.aadharfile.base64;
                $scope.labour.aadhar_encode_file_type = $scope.aadharfile.filetype;
            }
            if ($scope.bankfile != null) {
                $scope.labour.bank_filename = $scope.bankfile.filename;
                $scope.labour.bank_encode = $scope.bankfile.base64;
                $scope.labour.bank_encode_file_type = $scope.bankfile.filetype;
            }
            if ($scope.medicalcertificatefile != null) {
                $scope.labour.medical_filename = $scope.medicalcertificatefile.filename;
                $scope.labour.medical_certificate_encode = $scope.medicalcertificatefile.base64;
                $scope.labour.medical_certificate_encode_file_type = $scope.medicalcertificatefile.filetype;
            }
            if ($scope.eyecertificatefile != null) {
                $scope.labour.eye_certificate_filenmae = $scope.eyecertificatefile.filename;
                $scope.labour.eye_certificate_encode = $scope.eyecertificatefile.base64;
                $scope.labour.eye_certificate_encode_file_type = $scope.eyecertificatefile.filetype;
            }

            $scope.labour.tenant_id = $scope.tenantID;
           // $scope.labour.user_id = $rootScope.tenant.user_id;
            $scope.labour.created_by = $rootScope.tenant.user_id;
            $scope.labour.modified_by = $scope.tenantID;

            if ($scope.newLabourEnrollmentForm.$valid) {
                apiService.post('api/Labour/SaveLabour', $scope.labour, SaveLabourSucceess, SaveLabourFailed);
            }
            else { notificationService.displayError('Please enter mandatory fields'); }
        };

        function SaveLabourSucceess() {
            $scope.showSBForm = false;
            notificationService.displaySuccess('Worker saved successfully');
            $scope.labour = '';
            $scope.newLabourEnrollmentForm.$setPristine();
            $scope.newLabourEnrollmentForm.$setUntouched();
            $scope.labour_photo = '';
            $scope.aadharfile = '';
            $scope.bankfile = '';
            $scope.medicalcertificatefile = '';
            $scope.eyecertificatefile = '';
            GetLabourWiseList();
            $scope.addlabour = true;
            $scope.labour.aadhar = '';
        }
        function SaveLabourFailed() {
            notificationService.displayError('Worker Saved failed');
        }

        GetLabourWiseList();
        function GetLabourWiseList() {
            apiService.get('api/Labour/GetLaboursWiseList/' + $rootScope.tenant.tenant_id, null, LoadLabourWiseSucceess, LoadLabourWiseFailed);
            //apiService.get('api/Labour/GetnewLaboursList/' + $rootScope.tenant.user_id, null, LoadLabourWiseSucceess, LoadLabourWiseFailed);
        }
        function LoadLabourWiseSucceess(response) {
            $scope.LabourswiseList = response.data;
        }
        function LoadLabourWiseFailed() {
            notificationService.displayError('fetching Workers Wise list failed');
        }
        $scope.getImage = function (data) {
            return 'data:' + $scope.labour.labour_photo_file_type + ';base64,' + data;
        }
        $scope.getimageforedit = function (data) {

            return 'data:' + $scope.vehicles.driver_photo_file_type + ';base64,' + data;
        }
        $scope.hidebtn = false;
        $scope.addBtn = true;
        $scope.updateBtn = false;
        $scope.EditLabours = function (labors) {
            //$location.hash('refresh');
            $anchorScroll();
            $scope.hidebtn = true;
            $scope.clearbtn = false;
            $scope.addlabour = false;
            $scope.labour = {};
            $scope.addBtn = false;
            $scope.updateBtn = true;
            $scope.readOnlyStatus = false;
            $scope.field_readOnlyStatus = true;
            $scope.showSBForm = true;
            $scope.isEditable = true;
            $scope.namefile = true;
            $scope.labour = labors;
            $scope.labour.created_by = parseInt($scope.tenantID);
            $scope.labour.modified_by = parseInt($scope.tenantID);
            $scope.labour.age = new Date(labors.age);
            $scope.labour.current_contact_number = (labors.current_contact_number);
            $scope.labour.current_zip = parseInt(labors.current_zip);


            $scope.labour.permanent_contact_number = (labors.permanent_contact_number);
            $scope.labour.permanent_zip = parseInt(labors.permanent_zip);

            $scope.labour.contact_person_contact_number = (labors.contact_person_contact_number);
            $scope.labour.contact_person_zip = parseInt(labors.contact_person_zip);

            $scope.labour.bank_account_no = parseInt(labors.bank_account_no);
          //  $scope.labour.aadhar = parseInt(labors.aadhar);
            $scope.labour.aadhar = labors.aadhar;

            $scope.getCountryStates($scope.labour.current_country);
            $scope.getStateCities($scope.labour.current_state);

            $scope.getCountryStates2($scope.labour.contact_person_country);
            $scope.getStateCities2($scope.labour.contact_person_state);

            $scope.getCountryStates1($scope.labour.permanent_country);
            $scope.getStateCities1($scope.labour.permanent_state);

            var string = $scope.labour.aadhar_filename;
            var length = 30;
            $scope.aadharcertificate = string.substring(0, length);
            //$scope.aadharcertificate = $scope.labour.aadhar_filename;
           
            $scope.bankcertificate = $scope.labour.bank_filename.substring(0, 30);
           // $scope.bankcertificate = $scope.labour.bank_filename;
          
            $scope.medicalcertificate = $scope.labour.medical_filename.substring(0, 30);
            //$scope.medicalcertificate = $scope.labour.medical_filename;

            $scope.eyecertificate = $scope.labour.eye_certificate_filenmae.substring(0, 30);
            //$scope.eyecertificate = $scope.labour.eye_certificate_filenmae;

            
            $scope.labour_photo = $scope.getImage($scope.labour.labour_photo);
            if ($scope.labour_photo) {
                $scope.labourlogo = $scope.getImage($scope.labour.labour_photo);
            }
            else {
                $scope.labour_photo = "Content/images/Common/emp_photo.jpg";
            }
        };

        $scope.updateLabour = function () {
            $scope.addlabour = false;
            if (lbrphotocount > 0) {
                $scope.labour.labour_photo = $scope.labour_photo.base64;
                $scope.labour.labour_photo_file_type = $scope.labour_photo.filetype;
                $scope.labour.labour_filename = $scope.labour_photo.filename;
            }
            if (aadharcount > 0) {
                $scope.labour.aadhar_filename = $scope.aadharfile.filename;
                $scope.labour.aadhar_encode = $scope.aadharfile.base64;
                $scope.labour.aadhar_encode_file_type = $scope.aadharfile.filetype;
            }
            if (bankcount > 0) {
                $scope.labour.bank_filename = $scope.bankfile.filename;
                $scope.labour.bank_encode = $scope.bankfile.base64;
                $scope.labour.bank_encode_file_type = $scope.bankfile.filetype;
            }
            if (medcount > 0) {
                $scope.labour.medical_filename = $scope.medicalcertificatefile.filename;
                $scope.labour.medical_certificate_encode = $scope.medicalcertificatefile.base64;
                $scope.labour.medical_certificate_encode_file_type = $scope.medicalcertificatefile.filetype;
            }
            if (eyecount > 0) {
                $scope.labour.eye_certificate_filenmae = $scope.eyecertificatefile.filename;
                $scope.labour.eye_certificate_encode = $scope.eyecertificatefile.base64;
                $scope.labour.eye_certificate_encode_file_type = $scope.eyecertificatefile.filetype;
            }
            $scope.labour.created_by = $scope.tenantID;
            $scope.labour.modified_by = $scope.tenantID;
            if ($scope.newLabourEnrollmentForm.$valid) {
                apiService.post('api/Labour/UpdateLabour', $scope.labour, updateLabourSucceess, updateLabourFailed);
            }
            else {
                notificationService.displayError("Please enter mandatory fields");
            }


          
        };
        function updateLabourSucceess() {
            notificationService.displaySuccess("Labour Updated Successfully");
            $scope.labour = {};
            $scope.newLabourEnrollmentForm.$setPristine();
            $scope.newLabourEnrollmentForm.$setUntouched();
            $scope.labourlogo = '';
            $scope.showSBForm = false;
           // $scope.addBtn = true;
           // $scope.updateBtn = false;
            GetLabourWiseList();
            $scope.addlabour = true;

            lbrphotocount = 0;
            aadharcount = 0;
            bankcount = 0;
            medcount = 0;
            eyecount = 0;
            $scope.eyecertificatefile = '';
            $scope.medicalcertificatefile = '';
            $scope.bankfile = '';
            $scope.aadharfile = '';
        }
        function updateLabourFailed() {
            notificationService.displayError("Updating Labour failed");
        }


        $scope.checkprop = function () {
            if ($scope.labour_samecurrent == true) {
                $scope.labour.permanent_street = $scope.labour.current_street;
                $scope.labour.permanent_country = $scope.labour.current_country;
                $scope.getCountryStates1($scope.labour.permanent_country);
                $scope.labour.permanent_state = $scope.labour.current_state;
                $scope.getStateCities1($scope.labour.permanent_state);
                $scope.labour.permanent_city = $scope.labour.current_city;
                $scope.labour.permanent_zip = $scope.labour.current_zip;
                $scope.labour.permanent_contact_number = $scope.labour.current_contact_number;
            }
            else {
                $scope.labour.permanent_street = '';
                $scope.labour.permanent_country = '';
                $scope.labour.permanent_state = '';
                $scope.labour.permanent_city = '';
                $scope.labour.permanent_zip = '';
                $scope.labour.permanent_contact_number ='';
            }
        }

        /////mouse hover/////
        $scope.showlabourDetails = function (labors) {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Registration/labourviewdetails.html',
                controller: 'labourviewdetailsCtrl',
                resolve: {
                    labors: function () { return labors },
                }
            });
        }
        /////mouse hover////

        //download////
        $scope.downLoadImage1 = function () {
            var a = document.createElement('a');
            var filetype = $scope.labour.aadhar_encode_file_type;
            var data = $scope.labour.aadhar_encode;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'aadharimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'aadharForm.pdf';
                a.click();
            }
        }
        $scope.downLoadImage2 = function () {
            var a = document.createElement('a');
            var filetype = $scope.labour.bank_encode_file_type;
            var data = $scope.labour.bank_encode;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'bankimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'bankForm.pdf';
                a.click();
            }
        }
        $scope.downLoadImage3 = function () {
            var a = document.createElement('a');
            var filetype = $scope.labour.medical_certificate_encode_file_type;
            var data = $scope.labour.medical_certificate_encode;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'medicalimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'medicalForm.pdf';
                a.click();
            }
        }
        $scope.downLoadImage4 = function () {
            var a = document.createElement('a');
            var filetype = $scope.labour.eye_certificate_encode_file_type;
            var data = $scope.labour.eye_certificate_encode;
            if (filetype == 'image/jpeg') {
                a.href = 'data:image/jpeg;base64,' + data;
                a.download = 'eyecertimage.jpeg';
                a.click();
            }
            if (filetype == 'application/pdf') {
                a.href = 'data:application/pdf;base64,' + data;
                a.download = 'eyecertiForm.pdf';
                a.click();
            }
        }
        ////download///

        //send mail//
        $scope.sendgriddata = function () {
            var modalInstance = $modal.open({
                templateUrl: 'Scripts/Registration/sendmail.html',
                controller: 'sendmailCtrl',
            });
        }
        ///send mail///

        //$scope.search = function (row) {
        //    //return ((row.project_name.indexOf($scope.project || '') !== -1));
        //    $scope.result = row.name.indexOf($scope.labours || '') !== -1;
        //    return $scope.result;
        //};

    }
})(angular.module('common.core'));