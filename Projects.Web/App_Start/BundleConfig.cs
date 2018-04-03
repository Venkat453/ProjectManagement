using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace Projects.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/css/bootstrap.css",
                "~/Content/css/bootstrap-theme.css",
                "~/Content/css/angular-material.css",
                "~/Content/css/site.css",
                "~/Content/css/toastr.css",
                "~/Content/css/AdminLTE.css",
                "~/Content/css/AdminLTE.min.css",
                "~/Content/css/skin-blue.min.css",
                "~/Content/css/tooltips.min.css",
                "~/Content/css/font-awesome.min.css",
                "~/Content/css/loading-bar.css",
                "~/Content/css/xeditable.css",
                "~/Content/css/datepicker/default.css",
                "~/Content/css/datepicker/shCoreDefault.css",
                "~/Content/css/isteven-multi-select.css",
                "~/Content/css/adapt-strap.css",
                "~/Content/css/tooltips.min.css",
                "~/Content/alertifyjs/alertify.css",
                "~/Content/alertifyjs/alertify.rtl.css",
                "~/Content/alertifyjs/themes/bootstrap.css",
                "~/Content/alertifyjs/themes/bootstrap.rtl.css",
                "~/Content/alertifyjs/themes/default.css",
                "~/Content/alertifyjs/themes/default.rtl.css",
                "~/Content/alertifyjs/themes/semantic.css",
                "~/Content/alertifyjs/themes/semantic.rtl.css",
                "~/Content/ui-grid/ui-grid.css",
                "~/Content/ui-grid/ui-grid.min.css"
                ));

            bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
                "~/Scripts/Vendors/angular.js",
                "~/Scripts/Vendors/angular-animate.js",
                "~/Scripts/Vendors/angular-route.js",
                "~/Scripts/Vendors/angular-aria.js",
                "~/Scripts/Vendors/angular-ui.min.js",
                "~/Scripts/Vendors/angular-route.js",
                "~/Scripts/Vendors/angular-cookies.js",
                "~/Scripts/Vendors/angular-validator.js",
                "~/Scripts/Vendors/angular-base64.js",
                "~/Scripts/Vendors/angular-file-upload.js",
                "~/Scripts/Vendors/angucomplete-alt.min.js",
                "~/Scripts/Vendors/angular-mocks.js",
                "~/Scripts/Vendors/jquery-ui.js",
                "~/Scripts/Vendors/jQuery-2.1.4.min.js",
                "~/Scripts/Vendors/bootstrap.js",
                "~/Scripts/Vendors/respond.js",
                "~/Scripts/Vendors/jquery.raty.js",
                "~/Scripts/Vendors/respond.src.js",
                "~/Scripts/Vendors/ui-bootstrap-tpls-0.13.1.js",
                "~/Scripts/Vendors/underscore.js",
                "~/Scripts/Vendors/raphael.js",
                "~/Scripts/Vendors/morris.js",
                "~/Scripts/Vendors/jquery.fancybox.js",
                "~/Scripts/Vendors/jquery.fancybox-media.js",
                "~/Scripts/Vendors/bootstrap.min.js",
                "~/Scripts/Vendors/loading-bar.js",
                "~/Scripts/Vendors/leftsidebar-app.js",
                "~/Content/js/datepicker/zebra_datepicker.js",
                "~/Content/js/highcharts.js",
                "~/Content/js/exporting.js",
                "~/Content/js/highcharts-ng.js",
                "~/Content/js/highcharts-3d.js",
                "~/Content/js/drilldown.js",
                "~/Scripts/Vendors/toastr.js",
                "~/Content/js/isteven-multi-select.js",
                "~/Content/js/xeditable.js",
                "~/Scripts/Vendors/angular-sanitize.js",
                "~/Scripts/Vendors/adapt-strap.js",
                "~/Scripts/Vendors/adapt-strap.tpl.js",
                "~/Scripts/Vendors/angular-messages.min.js",
                "~/Scripts/Vendors/angular-message-format.min.js",
                "~/Scripts/Vendors/angular-material.min.js",
                "~/Scripts/Vendors/ngMask.min.js",
                "~/Scripts/Vendors/chance.js",
                "~/Scripts/Vendors/angular-base64-upload.js",
                "~/Scripts/Vendors/alertify.js",
                "~/Scripts/Vendors/dirpagination.js",
                "~/Scripts/Vendors/ui-grid.min.js",
                "~/Scripts/Vendors/jspdf.min.js",
                "~/Scripts/Vendors/jquery-ui-1.12.1.min.js",
                "~/Scripts/Vendors/ngStorage.js"
                ));

            bundles.Add(new StyleBundle("~/bundles/Common").Include(
                "~/Scripts/Common/common.core.js",
                "~/Scripts/Common/common.ui.js",
                "~/Scripts/Common/app.js",
                "~/Scripts/Common/Services/apiService.js",
                "~/Scripts/Common/Services/notificationService.js",
                "~/Scripts/Common/Services/membershipService.js",
                "~/Scripts/Common/Services/fileUploadService.js",
                "~/Scripts/Common/Services/countryService.js",
                "~/Scripts/Common/Layout/topBar.directive.js",
                "~/Scripts/Common/Layout/sideBar.directive.js",
                "~/Scripts/Common/Layout/customPager.directive.js",
                "~/Scripts/Common/Layout/myPagination.directive.js",
                "~/Scripts/Common/Layout/customReports.directive.js",
                "~/Scripts/Common/Login/rootCtrl.js",
                "~/Scripts/Common/Services/fileEncodeService.js"
                ));
            
            bundles.Add(new StyleBundle("~/bundles/Projects").Include(
                // Admin
                "~/Scripts/Admin/createuserCtrl.js",
                // Common
                "~/Scripts/Common/Error/ErrorLogCtrl.js",
                "~/Scripts/Common/Login/indexCtrl.js",
                "~/Scripts/Common/Login/LoginPageCtrl.js",
                "~/Scripts/Common/Login/register_userCtrl.js",
                "~/Scripts/Common/Login/changepwdCtrl.js",
                "~/Scripts/Common/Login/forgotPasswordCtrl.js",
                "~/Scripts/Common/Profile/myprofileCtrl.js",
                "~/Scripts/Common/Settings/smtpConfigurationCtrl.js",
                "~/Scripts/Common/Settings/ReferenceMasterCtrl.js",
                // Dashboard
                "~/Scripts/Dashboard/dashboardCtrl.js",
                "~/Scripts/Dashboard/sampleReportsCtrl.js",
                // Employee
                "~/Scripts/Employee/employeemasterCtrl.js",
                // Landing
                "~/Scripts/Landing/landingCtrl.js",
                "~/Scripts/Landing/passwordVerificationCtrl.js",
                // Master
                "~/Scripts/Master/Activity/activityCtrl.js",
                "~/Scripts/Master/ActivityReport/activityReportCtrl.js",
                "~/Scripts/Master/ItemMaster/itemMasterCtrl.js",
                "~/Scripts/Master/Makers/makersCtrl.js",
                "~/Scripts/Master/MaterialGrades/materialGradesCtrl.js",
                "~/Scripts/Master/ProjectGroups/projectGroupsCtrl.js",
                "~/Scripts/Master/ResourceMaster/resourceMasterCtrl.js",
                "~/Scripts/Master/SubAssembly/subAssemblyCtrl.js",
                "~/Scripts/Master/Variant/variantCtrl.js",
                "~/Scripts/Master/WorkCenter/workCenterCtrl.js",
                // Reports
                "~/Scripts/Reports/reportsCtrl.js",
                 // SuperAdmin
                 "~/Scripts/SuperAdmin/loginlogCtrl.js",
                "~/Scripts/SuperAdmin/refmasterCtrl.js",
                "~/Scripts/SuperAdmin/tenantsCtrl.js",
                "~/Scripts/SuperAdmin/usermenuaccessCtrl.js",
                // Tenant
                "~/Scripts/Tenant/tenantCtrl.js",
                // Transactions
                "~/Scripts/Transactions/PartList/partListCtrl.js",
                "~/Scripts/Transactions/ProjectCreations/projectCreationsCtrl.js",
                "~/Scripts/Transactions/ProjectStructure/projectStructureCtrl.js"
                ));
            
            BundleTable.EnableOptimizations = false;
        }
    }
}
