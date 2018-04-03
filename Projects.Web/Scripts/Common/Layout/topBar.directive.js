(function(app) {
    'use strict';

    app.directive('topBar', topBar);

    function topBar() {
        return {
            restrict: 'E',
            replace: true,
           templateUrl: '/Scripts/Common/Layout/topBar.html'
        }
    }
    //function logout() {
    //    $rootScope.tenant = {};
    //    $rootScope.ReferenceMasterData = {};
    //    $rootScope.CountriesList = {};
    //    $rootScope.StatesList = {};
    //    $rootScope.CitiesList = {};
    //    $rootScope.SCMasterList = {};
    //    $rootScope.MenuList = {};
    //    $rootScope.projectslists = {};
    //    $sessionStorage.MenuList = {};
    //    $sessionStorage.CitiesList = {};
    //    $sessionStorage.StatesList = {};
    //    $sessionStorage.tenant = {};
    //    $sessionStorage.ReferenceMasterData = {};
    //    $sessionStorage.CountriesList = {};
    //    $rootScope.user = {};
    //    alert("logout");
    //    $location.url("/");
    //}



})(angular.module('common.ui'));


$(document).ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active')
    });
});