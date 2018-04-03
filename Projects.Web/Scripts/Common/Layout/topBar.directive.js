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

})(angular.module('common.ui'));


$(document).ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active')
    });
});