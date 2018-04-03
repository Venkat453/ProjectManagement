(function (app) {
    'use strict';
    app.controller('ViewpollutiondetailsCtrl', ViewpollutiondetailsCtrl);
    ViewpollutiondetailsCtrl.$inject = ['$scope', '$rootScope', 'apiService', 'notificationService', '$filter', '$http', '$modalInstance', '$modal', 'vehicle'];

    function ViewpollutiondetailsCtrl($scope, $rootScope, apiService, notificationService, $filter, $http, $modalInstance, $modal, vehicle) {
       
        $scope.vehicle = vehicle;

        $scope.pollution_validdate = '';
        $scope.pollutionimage = '';
        $scope.closeclientmodal = closeclientmodal;
        function closeclientmodal() {
            $modalInstance.close();
        }
        //////for driverlogo///////
        $('#d_file').change(function (event) {
            $("#imgdriverlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });
        $("#imgdriverlogo").click(function () {
            $("#d_file").trigger("click");
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
        //////driver logo/////


        ///getting from db/////
        //$scope.getImage = function (data) {
        //    return 'data:' + $scope.vehicle.driver_photo_file_type + ';base64,' + data;
        //}

        ////$scope.getimageforedit = function (data) {

        ////    return 'data:' + $scope.vehicle.driver_photo_file_type + ';base64,' + data;
        ////}


        //$scope.driver_photo = $scope.getImage(vehicle.driver_photo);
        //if ($scope.driver_photo) {
        //    $scope.driverlogo = $scope.getImage(vehicle.driver_photo);
        //}
        //else {
        //    $scope.driverlogo = "Content/images/Common/emp_photo.jpg";
        //}

        ///getting from db/////

        /////for pollute /////

        $('#p_file').change(function (event) {
            $("#imgpollutelogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });
        $("#imgpollutelogo").click(function () {
            $("#p_file").trigger("click");
        });
        GetpooluteFile();
        function GetpooluteFile() {
            if ($scope.Pollutionlogo != null && $scope.Pollutionlogo != '') {
                $scope.Pollutionlogo = $scope.getImage($scope.Pollutionlogo);
            }
            else {
                $scope.Pollutionlogo = "Content/images/Common/emp_photo.jpg";
            }
        }

        $scope.getImage = function (data) {
            return 'data:' + $scope.vehicle.pollutionimage_filetype + ';base64,' + data;
        }

        //$scope.getimageforedit = function (data) {

        //    return 'data:' + $scope.vehicle.driver_photo_file_type + ';base64,' + data;
        //}


        $scope.pollutionimage = $scope.getImage(vehicle.pollutionimage);
        if ($scope.pollutionimage) {
            $scope.Pollutionlogo = $scope.getImage(vehicle.pollutionimage);
        }
        else {
            $scope.Pollutionlogo = "Content/images/Common/emp_photo.jpg";
        }
        /////for pollute /////

        ////for fitness////
        $('#f_file').change(function (event) {
            $("#imgfitnesslogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });
        $("#imgfitnesslogo").click(function () {
            $("#f_file").trigger("click");
        });
        GetpolluteFile();
        function GetpolluteFile() {
            if ($scope.Fitnesslogo != null && $scope.Fitnesslogo != '') {
                $scope.Fitnesslogo = $scope.getImage($scope.Fitnesslogo);
            }
            else {
                $scope.Fitnesslogo = "Content/images/Common/emp_photo.jpg";
            }
        }

        $scope.getImage = function (data) {
            return 'data:' + $scope.vehicle.fitnessimage_filetype + ';base64,' + data;
        }

        $scope.fitnessimage = $scope.getImage(vehicle.fitnessimage);
        if ($scope.fitnessimage) {
            $scope.Fitnesslogo = $scope.getImage(vehicle.fitnessimage);
        }
        else {
            $scope.Fitnesslogo = "Content/images/Common/emp_photo.jpg";
        }
        ////for fitness////
        $('#i_file').change(function (event) {
            $("#imgfitnesslogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));

        });
        $("#imgfitnesslogo").click(function () {
            $("#i_file").trigger("click");
        });
        GetinsuranceFile();
        function GetinsuranceFile() {
            if ($scope.Insurencelogo != null && $scope.Insurencelogo != '') {
                $scope.Insurencelogo = $scope.getImage($scope.Insurencelogo);
            }
            else {
                $scope.Insurencelogo = "Content/images/Common/emp_photo.jpg";
            }
        }

        $scope.getImage = function (data) {
            return 'data:' + $scope.vehicle.insurenceimage_filetype + ';base64,' + data;
        }

        $scope.insurenceimage = $scope.getImage(vehicle.insurenceimage);
        if ($scope.insurenceimage) {
            $scope.Insurencelogo = $scope.getImage(vehicle.insurenceimage);
        }
        else {
            $scope.Insurencelogo = "Content/images/Common/emp_photo.jpg";
        }
    }
})(angular.module('common.core'));
