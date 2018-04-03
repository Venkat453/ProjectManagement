(function () {
    'use strict';
    /// 
    angular.module('Projects', ['common.core', 'common.ui', 'isteven-multi-select', 'xeditable', 'ngSanitize', 'ngMaterial', 'ngMessages', 'ngMask', 'naif.base64', 'angularUtils.directives.dirPagination', 'ui.grid', 'ui.filters','ngStorage']).config(config);

    function config($routeProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        //$mdIconProvider.defaultIconSet('Content/fonts/mdi.svg');

        $routeProvider
            .when("/", {
                templateUrl: "Scripts/Common/Login/LoginPage.html", controller: "LoginPageCtrl"
            })

            .when("/Index", {
                templateUrl: "Scripts/Common/Login/index.html", controller: "indexCtrl"
            })

            .when("/Users", {
                templateUrl: "Scripts/Common/Login/register_user.html", controller: "register_userCtrl"
            })

            .when("/UserAccess", {
                templateUrl: "Scripts/SuperAdmin/usermenuaccess.html", controller: "usermenuaccessCtrl"
            })

            .when("/Tenant", {
                templateUrl: "Scripts/Tenant/tenant.html", controller: "tenantCtrl"
            })

            .when("/MyProfile", {
                templateUrl: "Scripts/Common/Profile/myprofile.html", controller: "myprofileCtrl"
            })

            .when("/Tenants", {
                templateUrl: "Scripts/SuperAdmin/tenants.html", controller: "tenantsCtrl"
            })

            .when("/ErrorLog", {
                templateUrl: "Scripts/Common/Error/ErrorLog.html", controller: "ErrorLogCtrl"
            })

            .when("/LoginLog", {
                templateUrl: "Scripts/SuperAdmin/loginlog.html", controller: "loginlogCtrl"
            })

            .when("/RefMaster", {
                templateUrl: "Scripts/SuperAdmin/refmaster.html", controller: "refmasterCtrl"
            })

            .when("/EmployeeMaster", {
                templateUrl: "Scripts/Master/employeemaster.html", controller: "employeemasterCtrl"
            })

            .when("/Settings", {
                templateUrl: "Scripts/Master/settings.html", controller: "settingsCtrl"
            })

            .when("/Dashboard", {
                templateUrl: "Scripts/Dashboard/dashboard.html", controller: "dashboardCtrl"
            })
            .when("/SampleReports", {
                templateUrl: "Scripts/Dashboard/sampleReports.html", controller: "sampleReportsCtrl"
            })

            .when("/Landing", {
                templateUrl: "Scripts/Landing/landing.html", controller: "landingCtrl"
            })

            .when("/Activity", {
                templateUrl: "Scripts/Master/Activity/activity.html", controller: "activityCtrl"
            })

            .when("/ActivityReport", {
                templateUrl: "Scripts/Master/ActivityReport/activityReport.html", controller: "activityReportCtrl"
            })

            .when("/ItemMaster", {
                templateUrl: "Scripts/Master/ItemMaster/itemMaster.html", controller: "itemMasterCtrl"
            })

            .when("/Makers", {
                templateUrl: "Scripts/Master/Makers/makers.html", controller: "makersCtrl"
            })

            .when("/MaterialGrades", {
                templateUrl: "Scripts/Master/MaterialGrades/materialGrades.html", controller: "materialGradesCtrl"
            })

            .when("/ProjectGroups", {
                templateUrl: "Scripts/Master/ProjectGroups/projectGroups.html", controller: "projectGroupsCtrl"
            })

            .when("/ResourceMaster", {
                templateUrl: "Scripts/Master/ResourceMaster/resourceMaster.html", controller: "resourceMasterCtrl"
            })

            .when("/SubAssembly", {
                templateUrl: "Scripts/Master/SubAssembly/subAssembly.html", controller: "subAssemblyCtrl"
            })

            .when("/Variant", {
                templateUrl: "Scripts/Master/Variant/variant.html", controller: "variantCtrl"
            })

            .when("/WorkCenter", {
                templateUrl: "Scripts/Master/WorkCenter/workCenter.html", controller: "workCenterCtrl"
            })

            .when("/ActivityMaster", {
                templateUrl: "Scripts/Master/ActivityMaster/activityMaster.html", controller: "activityMasterCtrl"
            })

            .when("/Reports", {
                templateUrl: "Scripts/Reports/reports.html", controller: "reportsCtrl"
            })

            .when("/PartList", {
                templateUrl: "Scripts/Transactions/PartList/partList.html", controller: "partListCtrl"
            })

            .when("/ProjectCreations", {
                templateUrl: "Scripts/Transactions/ProjectCreations/projectCreations.html", controller: "projectCreationsCtrl"
            })

            .when("/ProjectStructure", {
                templateUrl: "Scripts/Transactions/ProjectStructure/projectStructure.html", controller: "projectStructureCtrl"
            })

            .otherwise({ redirectTo: "/" });

    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

    function run($rootScope, $location, $cookieStore, $http) {
        // handle page refreshes
        $rootScope.repository = $cookieStore.get('repository') || {};

        if ($rootScope.repository.loggedUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.repository.loggedUser.authdata;
        }

        $(document).ready(function () {
            $(".fancybox").fancybox({
                openEffect: 'none',
                closeEffect: 'none'
            });

            $('.fancybox-media').fancybox({
                openEffect: 'none',
                closeEffect: 'none',
                helpers: {
                    media: {}
                }
            });

            $('[data-toggle=offcanvas]').click(function () {
                $('.row-offcanvas').toggleClass('active');
            });
        });
    }

    isAuthenticated.$inject = ['membershipService', '$rootScope', '$location'];

    function isAuthenticated(membershipService, $rootScope, $location) {
        if (!membershipService.isUserLoggedIn()) {
            $rootScope.previousState = $location.path();
            $location.path('/');
        }
    }



})();
