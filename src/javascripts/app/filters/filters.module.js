var FiltersModule = angular.module('app.filters', ['ui.router', 'restangular', 'pascalprecht.translate']);

FiltersModule.filter('orderElement', require('./OrderElement'));
FiltersModule.filter('stripTags', require('./StripTags'));
