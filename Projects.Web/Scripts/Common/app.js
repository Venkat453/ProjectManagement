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

            .when("/Company", {
                templateUrl: "Scripts/Company/register_company.html", controller: "register_companyCtrl"
            })

            .when("/Representative", {
                templateUrl: "Scripts/Representative/add_representative.html", controller: "add_representativeCtrl"
            })

            .when("/Customer", {
                templateUrl: "Scripts/Customer/add_customer.html", controller: "add_customerCtrl"
            })

            .when("/Invoice", {
                templateUrl: "Scripts/Customer/invoice.html", controller: "invoiceCtrl"
            })

            .when("/Product", {
                templateUrl: "Scripts/Product/products.html", controller: "productsCtrl"
            })

            .when("/PurchaseOrder", {
                templateUrl: "Scripts/PurchaseOrder/po.html", controller: "poCtrl"
            })

            .when("/CreateUser", {
                templateUrl: "Scripts/Admin/createuser.html", controller: "createuserCtrl"
            })
            .when("/Subcontractors", {
                templateUrl: "Scripts/Registration/subcontractors.html", controller: "subcontractorsCtrl"
            })
            .when("/Labors", {
                templateUrl: "Scripts/Registration/labors.html", controller: "laborsCtrl"
            })
            .when("/Vehicle", {
                templateUrl: "Scripts/Registration/vehicle.html", controller: "vehicleCtrl"
            })
            .when("/PoliceStations", {
                templateUrl: "Scripts/Registration/policestations.html", controller: "policestationsCtrl"
            })
            .when("/Junctions", {
                templateUrl: "Scripts/Registration/junctions.html", controller: "junctionsCtrl"
            })
            .when("/EmployeeMaster", {
                templateUrl: "Scripts/Master/employeemaster.html", controller: "employeemasterCtrl"
            })
            .when("/WorkAssignment", {
                templateUrl: "Scripts/SiteManagement/workassignment.html", controller: "workassignmentCtrl"
            })
            .when("/WorkProgress", {
                templateUrl: "Scripts/SiteManagement/workprogress.html", controller: "workprogressCtrl"
            })
            .when("/WorkVerification", {
                templateUrl: "Scripts/SiteManagement/workverification.html", controller: "workverificationCtrl"
            })
            .when("/Induction", {
                templateUrl: "Scripts/Induction/induction.html", controller: "inductionCtrl"
            })
            .when("/MaterialManagement", {
                templateUrl: "Scripts/Inventory/materialManagement.html", controller: "materialManagementCtrl"
            })
              .when("/FieldworkPrice", {
                  templateUrl: "Scripts/Inventory/fieldworkprice.html", controller: "fieldworkpriceCtrl"
              })
            .when("/Indent", {
                templateUrl: "Scripts/Inventory/createIndent.html", controller: "createIndentCtrl"
            })
            .when("/ProjectMaster", {
                templateUrl: "Scripts/Master/projectmaster.html", controller: "projectmasterCtrl"
            })

             .when("/RateChart", {
                 templateUrl: "Scripts/RateChart/ratechart.html", controller: "ratechartCtrl"
             })

            .when("/Settings", {
                templateUrl: "Scripts/Master/settings.html", controller: "settingsCtrl"
            })

            .when("/ProjectComponents", {
                templateUrl: "Scripts/Master/projectComponents.html", controller: "projectComponentsCtrl"
            })

            .when("/Dashboard", {
                templateUrl: "Scripts/Dashboard/dashboard.html", controller: "dashboardCtrl"
            })
            .when("/SampleReports", {
                templateUrl: "Scripts/Dashboard/sampleReports.html", controller: "sampleReportsCtrl"
            })
            .when("/Warehouse", {
                templateUrl: "Scripts/Inventory/warehouse.html", controller: "warehouseCtrl"
            })
            .when("/OrderForm", {
                templateUrl: "Scripts/PayuMoney/orderForm.html", controller: "orderFormCtrl"
            })
            .when("/ReturnSuccess", {
                templateUrl: "Scripts/PayuMoney/returnSuccess.html", controller: "returnSuccessCtrl"
            })
            .when("/ReturnFails", {
                templateUrl: "Scripts/PayuMoney/returnFailure.html", controller: "returnFailureCtrl"
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
