import angular from 'angular';

require('angular-ui-router');
require('restangular');

var LayoutModule = angular.module('app.layout', ['ui.router', 'restangular', 'pascalprecht.translate']);

LayoutModule.directive('maMenuBar', require('./maMenuBar'));