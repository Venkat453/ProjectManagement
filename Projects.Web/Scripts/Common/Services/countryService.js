(function (app) {
    'use strict';
    app.factory("countryService", ['$filter', 'apiService', function ($filter, apiService) {
        var service = [];
        var countrylist = [];
        var statelist = [];
        var citylist = [];

        service.getCountry = function () {
            return countrylist;
        };
        service.getCountryStateCityLoaded = function () {

            apiService.get('api/MasterData/GetCityList', null, GetCitiesListComplete, null);
            apiService.get('api/MasterData/GetStateList', null, GetStatesListComplete, null);
            apiService.get('api/MasterData/GetCountryList', null, GetCountriesListComplete, null);
            return '';
        };

        service.getCountryState = function (countryid) {
            var states = ($filter('filter')(statelist, { country_id: countryid }, true));
            return states;
        };

        service.getStateCity = function (stateid) {

            var cities = ($filter('filter')(citylist, { state_id: stateid }, true));
            return cities;
        };

        function GetCountriesListComplete(response) {
            countrylist = response.data;
        }
        function GetStatesListComplete(response) {
            statelist = response.data;
        }
        function GetCitiesListComplete(response) {
            citylist = response.data;
        }
        

        return service;

    }]);

})(angular.module('common.core'));