import angular from 'angular';

require('angular-ui-router');
require('restangular');

var DashboardModule = angular.module('app.dashboard', ['ui.router', 'restangular', 'pascalprecht.translate']);

DashboardModule.controller('DashboardController', require('./dashboard.controller'));

DashboardModule.directive('maDashboardPanel', require('./maDashboardPanel'));

