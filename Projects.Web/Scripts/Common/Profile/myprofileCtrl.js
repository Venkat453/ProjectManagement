(function (app) {
    app.controller('myprofileCtrl', myprofileCtrl);
    myprofileCtrl.$inject = ['$scope', '$location', '$rootScope', 'apiService', 'notificationService', '$modal', '$filter']
    function myprofileCtrl($scope, $location, $rootScope, apiService, notificationService, $modal, $filter) {

        $rootScope.Loadsaveuserlog();
        $rootScope.myprofile =[];

       loadmaster();
        function loadmaster() {
            apiService.get('api/UserProfile/UserProfileList/' + $rootScope.tenant.username, null, UsersLoadComplete, UsersLoadFailed);
        }

        function UsersLoadComplete(response) {
            $rootScope.myprofile = response.data[0];
            if ($rootScope.myprofile.logo) {
                $scope.myprofilelogo = $scope.getImage($rootScope.myprofile.logo);
            }
            else {
                $scope.myprofilelogo = "Content/images/Common/emp_photo.jpg";
            } 
        }

        function UsersLoadFailed() {
              notificationService.displayError("User Profile data failed");
        }

        $("#imgtenantlogo").click(function () {
            $("#s_file").trigger("click");
        });

        $scope.getImage = function (data) {
            return 'data:' + $rootScope.myprofile.logo_image_type + ';base64,' + data;
        }

        var photocount = 0;
        $('#s_file').change(function (event) {
            var filesSelected = document.getElementById("s_file").files;

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
            $("#imguserlogo").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));
            photocount++;
        });
        $("#imguserlogo").click(function () {
            $("#s_file").trigger("click");
        });

        $scope.updateProfile = function()
        {
            if ($scope.profile_photo != null) {
                $scope.myprofile.logo = $scope.profile_photo.base64;
                $scope.myprofile.logo_image_type = $scope.profile_photo.filetype;
                $scope.myprofile.profile_photo_file_name = $scope.profile_photo.filename;
            }
            apiService.post('api/UserProfile/updateUserProfile', $scope.myprofile, UsersUpdateComplete, UsersUpdateFailed);
        }
        function UsersUpdateComplete(response) {
            notificationService.displaySuccess("Your Profile Updated Successfully !"); 
            $rootScope.user.userlogo = $scope.myprofile.logo;
            $rootScope.user.userlogofiletype = $scope.myprofile.logo_image_type;
        }

        function UsersUpdateFailed() {
            notificationService.displayError("Profile not updated !");
        }
    }
})(angular.module('common.core'));