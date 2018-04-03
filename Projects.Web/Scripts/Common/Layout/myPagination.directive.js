(function(app) {
    'use strict';

    app.directive('paginateBar', paginateBar);

    function paginateBar() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/Scripts/Common/Layout/paginateBar.html',
            link: function ($scope, $element, $attrs) {
                var lastInd = -1;
                var incInd = 10;
                var decInd = -1;

                $scope.currentPage = 0;
                $scope.pageSize = 10;

                $scope.showFirst = function () {
                    $scope.currentPage = 0;
                    incInd = 10;
                    decInd = -1;
                    lastInd = -1;
                };
                $scope.showLast = function () {
                    $scope.currentPage = Math.ceil($scope.totalItems / $scope.pageSize) - 1;
                    incInd = $scope.currentPage + 1;
                    decInd = $scope.currentPage - 10;
                    lastInd = $scope.currentPage + 1;
                };
                $scope.showPrevious = function () {
                    //alert($scope.currentPage + ' incInd:' + incInd + ' decInd' + decInd);
                    if ($scope.currentPage != 0) {
                        $scope.currentPage--;
                    }
                    if (incInd > 10) {
                        incInd--;
                        decInd--;
                    }
                };
                $scope.showNext = function () {
                    //alert($scope.currentPage + ' incInd:' + incInd + ' decInd' + decInd + '  ' + Math.ceil($scope.icd10diagcode.length / $scope.pageSize));
                    if (incInd < Math.ceil($scope.totalItems / $scope.pageSize)) {
                        $scope.currentPage++;
                        incInd++;
                        decInd++;
                    }
                };
                $scope.set_color = function (ind) {
                    if (ind == $scope.currentPage) {
                        return { backgroundColor: "dodgerblue", color: "white" }
                    }
                };
                $scope.setCurrentPage = function (currentPage) {
                    $scope.currentPage = currentPage;
                    if (currentPage > lastInd) {
                        incInd++;
                        decInd++;
                    }
                    else if (currentPage < lastInd && incInd > 10) {
                        incInd--;
                        decInd--;
                    }
                    lastInd = currentPage;
                }

                $scope.getNumberAsArray = function (num) {
                    return new Array(num);
                };

                $scope.numberOfPages = function () {
                    return Math.ceil($scope.totalItems / $scope.pageSize);
                };

                $scope.showBtn = function (ind) {
                    if (ind < incInd && ind > decInd) { 
                        return true;
                    }
                    return false;
                };
            }
        }
    }
})(angular.module('common.ui'));