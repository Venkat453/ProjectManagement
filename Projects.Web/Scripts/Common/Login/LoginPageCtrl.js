(function (app) {
    'use strict';
    app.controller('LoginPageCtrl', LoginPageCtrl);
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

    LoginPageCtrl.$inject = ['$scope', 'apiService', 'membershipService', 'notificationService', '$rootScope', '$location', '$cookies', '$cookieStore', '$modal','$sessionStorage'];

    function LoginPageCtrl($scope, apiService, membershipService, notificationService, $rootScope, $location, $cookies, $cookieStore, $modal, $sessionStorage) {

        $scope.pageClass = 'page-login';
        $scope.user = {};
        $scope.msg = '';
        $rootScope.MenuList = [];
        $scope.tenant_key = chance.fbid();
        $scope.logintrack = {};
        $scope.savelog = {};

        $scope.forgotPassword = function () {
            {
                var modalInstance = $modal.open({
                    templateUrl: 'Scripts/Common/Login/forgotPassword.html',
                    controller: 'forgotPasswordCtrl',
                    scope: $scope,
                });
            }
        };



        $(document).ready(function () {
            $("#rotate").click(function () {
                $(".flip3D").toggleClass("rotated");
            });

            //$('#companyname').keyup(function () {
            //    $(this).val($(this).val().toUpperCase());
            //});

            //$('#owner').keyup(function () {
            //    $(this).val($(this).val().toUpperCase());
            //});

            $('#email').keyup(function () {
                $(this).val($(this).val().toLowerCase());
            });
        });

        $(".register").click(function () {
            $(this).text(function (i, v) {
                return v === 'Register' ? 'Login' : 'Register'
            })
            $(".lblregister").text(function (i, v) {
                return v === 'Not yet registered?' ? 'Already registered?' : 'Not yet registered?'
            })
        });

        $(function () {

            $.support.css3d = supportsCSS3D();
            var formContainer = $('#formContainer');

            $('.flipLink').click(function (e) {

                formContainer.toggleClass('flipped');

                if (!$.support.css3d) {
                    $('#login').toggle();
                }
                e.preventDefault();
            });

            formContainer.find('form').submit(function (e) {
                e.preventDefault();
            });

            function supportsCSS3D() {
                var props = [
                    'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
                ], testDom = document.createElement('a');

                for (var i = 0; i < props.length; i++) {
                    if (props[i] in testDom.style) {
                        return true;
                    }
                }

                return false;
            }
        });

        $scope.Login = function () {
            membershipService.login($scope.user, loginCompleted)
        }

        function loginCompleted(result) {
            if (result.data.success) { 
                membershipService.saveCredentials($scope.user);

                $rootScope.tenant = {
                    'user_id': result.data.user_id,
                    'userid': $scope.userid,
                    'username': result.data.username,
                    'user_image': '',
                    'role_id': result.data.roleid,
                    'tenant_id': result.data.tenantid,
                    'tenantkey': result.data.tenantkey,
                    'tenantemail': result.data.tenantemail,
                    'tenantlogo': result.data.tenantlogo,
                    'tenantlogofiletype': result.data.tenantlogoimagetype,
                    'is_tenant':result.data.is_tenant
                }; 
                $sessionStorage.tenant = $rootScope.tenant;

                if (result.data.is_tenant) {
                    $rootScope.user = {
                        'is_tenant': result.data.is_tenant,
                        'profileURL': "/Tenant"
                    }
                    $sessionStorage.user = $rootScope.user;
                }
                else { 
                    $rootScope.user = {
                        'is_tenant': result.data.is_tenant,
                        'profileURL': "/MyProfile",
                        'userlogo': result.data.userlogo,
                        'userlogofiletype': result.data.userlogofiletype,
                        'Userkey': result.data.tenantkey
                    } 
                    $sessionStorage.user = $rootScope.user;

                }

                GetMenuList();

                apiService.get('api/MasterData/GetReferenceMasterData/0', null, RefMasterLoadComplete, RefMasterLoadFailed); //Getting data from ReferenceMaster

                $scope.logintrack.user_id = $rootScope.user_id;
                apiService.post('api/LoginTrack/TrackLogin', $scope.logintrack, trackComplete, null); //Tracking Login

                function trackComplete(response) {

                }

                $scope.userData.displayUserInfo();

                $location.url("/Dashboard");

                //if ($rootScope.previousState) {
                //    $location.path($rootScope.previousState);
                //    $location.url("/Index");
                //}
                //else
                //    $location.path('/');
                LoadMaster();
            }
                //}
            else {
                $scope.msg = 'Invalid UserID or Password.';
                notificationService.displayError('Login failed. Please try again.');
            }

            LoadProjectsList();
        }

        function RefMasterLoadComplete(response) {
            $rootScope.ReferenceMasterData = response.data;
            $sessionStorage.ReferenceMasterData = $rootScope.ReferenceMasterData;
        }

        function RefMasterLoadFailed(response) {
            notificationService.displayError("Unable to Get Reference Master Data");
        }

        
        $rootScope.Loadsaveuserlog = function () {
            $scope.savelog.userid = $rootScope.tenant.user_id;
            $scope.savelog.user_name = $rootScope.tenant.username;
            $scope.savelog.reference_url = $location.path();
            $scope.savelog.page_url = $location.absUrl();
            apiService.post('api/Log/SaveLog', $scope.savelog);
        }
      
        function LoadMaster() {
            apiService.get('api/MasterData/GetCountryList', null, GetCountriesListComplete, GetCountriesListFailed);
            apiService.get('api/MasterData/GetStateList', null, GetStatesListComplete, GetStatesListFailed);
            apiService.get('api/MasterData/GetCityList', null, GetCitiesListComplete, GetCitiesListFailed);
            apiService.get('api/SubContractor/getSubContractorsList/' + $rootScope.tenant.tenant_id, null, SubContractorsListLoadComplete, SubContractorsListLoadFailed);
        }
        function GetCountriesListComplete(response) {
            $rootScope.CountriesList = response.data;
            $sessionStorage.CountriesList = $rootScope.CountriesList;
        }
        function GetCountriesListFailed(response) {
            notificationService.displayError("Countries could not be loaded !");
        }

        function GetStatesListComplete(response) {
            $rootScope.StatesList = response.data;
            $sessionStorage.StatesList = $rootScope.StatesList;
        }
        function GetStatesListFailed(response) {
            notificationService.displayError("States could not be loaded !");
        }

        function GetCitiesListComplete(response) {
            $rootScope.CitiesList = response.data;
            $sessionStorage.CitiesList = $rootScope.CitiesList;
        }
        function GetCitiesListFailed(response) {
            notificationService.displayError("Cities could not be loaded !");
        }
        function SubContractorsListLoadComplete(response) {
            $rootScope.SCMasterList = response.data;
        }
        function SubContractorsListLoadFailed() {
            notificationService.displayError('fetching subcontractorslist failed');
        }

        $scope.RegisterTenant = function () {
            $scope.tenant.tenant_key = $scope.tenant_key;
            $scope.tenant.tenant_type = 1;
            $scope.tenant.IsLocked = false;
            $scope.tenant.created_by = 1;
            $scope.tenant.modified_by = 1;
            //number  of days to add, e.x. 30 days
            var date1 = new Date();
            date1.setDate(date1.getDate() + 30);
            $scope.tenant.account_valid_till = date1;

            apiService.post('api/Tenant/CreateTenant', $scope.tenant, TenantCreateComplete, TenantCreateFailed);
        }

        function TenantCreateComplete(response) {
            notificationService.displaySuccess("Registration Success!!!");
        }

        function TenantCreateFailed(response) {
            if (response.data == 'Email is already Exist!')
            {
                notificationService.displayError("Email is already Exist!");
            }
            else
            {
                notificationService.displayError("Registration Failed. Please try again!");
            }
        }

        function GetMenuList() {
            apiService.get('api/MenuAccess/GetMenuList/' + $rootScope.tenant.user_id, null, GetMenuListComplete, null);
        }

        function GetMenuListComplete(response) {
            $rootScope.MenuList = response.data;
            $sessionStorage.MenuList = $rootScope.MenuList;
        }


        function LoadProjectsList() {
            apiService.get('api/ProjectMaster/GetProjectsList/' + $rootScope.tenant.tenant_id, null, GetProjectsListLoadComplete, GetProjectsListLoadFailed);
        }
        function GetProjectsListLoadComplete(response) {
            $rootScope.projectslists = response.data;
            //$scope.projectslist = $rootScope.projectslists;
            //$scope.totalItems = $scope.projectslist.length;
            //notificationService.displaySuccess('ProjectMaster Load Successfully!');
        }
        function GetProjectsListLoadFailed() {
            notificationService.displayError('unable to get Project List');
        }

        $scope.checkemail = function () {
            apiService.post('api/account/Emailisexits', $scope.tenant, CheckEmailComplete);
        };
        function CheckEmailComplete(response) {
            if (response.data == true) {
                document.getElementById('email').focus();
                $scope.tenant.email = '';
                notificationService.displayError("Email is already exits!!!");
                $scope.registerform.$setPristine();
                $scope.registerform.$setUntouched();
            }
        };
        
    }
})(angular.module('common.core'));