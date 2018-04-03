(function (app) {
    'use strict';

    app.controller('smtpConfigurationCtrl', smtpConfigurationCtrl);

    smtpConfigurationCtrl.$inject = ['$scope', 'apiService', 'notificationService', '$rootScope', '$location'];

    app.directive('clickToEdit', function ($timeout) {
        return {
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                type: '@type'
            },
            replace: true,
            transclude: false,
            // includes our template
            template:
                '<div class="templateRoot">' +
                    '<div class="hover-edit-trigger" title="click to edit">' +
                        '<div class="hover-text-field" ng-show="!editState" ng-click="toggle()">{{model}}<div class="edit-pencil glyphicon glyphicon-pencil"></div></div>' +
                        '<input class="inputText" type="text" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'inputText\'" />' +
                    '</div>' +
                    '<div class="edit-button-group pull-right" ng-show="editState">' +
                        '<div class="glyphicon glyphicon-ok"  ng-click="save()"></div>' +
                        '<div class="glyphicon glyphicon-remove" ng-click="cancel()"></div>' +
                    '</div>' +
                '</div>',
            link: function (scope, element, attrs) {
                scope.editState = false;

                // make a local ref so we can back out changes, this only happens once and persists
                scope.localModel = scope.model;

                // apply the changes to the real model
                scope.save = function () {
                    scope.model = scope.localModel;
                    scope.toggle();
                };

                // don't apply changes
                scope.cancel = function () {
                    scope.localModel = scope.model;
                    scope.toggle();
                }

                /*
                 * toggles the editState of our field
                 */
                scope.toggle = function () {

                    scope.editState = !scope.editState;

                    /*
                     * a little hackish - find the "type" by class query
                     *
                     */
                    var x1 = element[0].querySelector("." + scope.type);

                    /*
                     * could not figure out how to focus on the text field, needed $timout
                     * http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field-in-angularjs
                     */
                    $timeout(function () {
                        // focus if in edit, blur if not. some IE will leave cursor without the blur
                        scope.editState ? x1.focus() : x1.blur();
                    }, 0);
                }
            }
        }
    });

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    function smtpConfigurationCtrl($scope, apiService, notificationService, $rootScope, $location) {

        $rootScope.Loadsaveuserlog();

        //===================================================================
        GetSMTPDetails();
        function GetSMTPDetails() {
            apiService.get('api/settings/getSMTP', null, smtpLoadComplete, smtpLoadFailed);
        }

        function smtpLoadComplete(response) {
            $scope.smtplist = response.data;
        }

        function smtpLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        //======================================================================

        //SaveSMTPDetails();
        function SaveSMTPDetails() {
            apiService.get('api/settings/SaveSMTP', null, smtpSaveComplete, smtpSaveFailed);
        }

        function smtpSaveComplete(response) {
            $scope.smtplist = response.data;
        }

        function smtpSaveFailed(response) {
            notificationService.displayError(response.data);
        }

        //======================================================================
    }

})(angular.module('common.core'));