import angular from 'angular';

require('angular-ui-router');
require('restangular');

var LayoutModule = angular.module('app.layout', ['ui.router', 'restangular', 'pascalprecht.translate']);

LayoutModule.directive('maMenuBar', require('./maMenuBar'));
LayoutModule.directive('rdFooter', require('./rd-footer.directive'));
LayoutModule.directive('rdHeader', require('./rd-header.directive'));
LayoutModule.directive('rdNavigation', require('./rd-navigation.directive'));
LayoutModule.directive('aside', require('./aside.directive'));

LayoutModule.directive('setNgAnimate', require('./directives/setnganimate'));
LayoutModule.directive('uiButterbar', require('./directives/ui-butterbar'));
LayoutModule.directive('uiFocus', require('./directives/ui-focus'));
// LayoutModule.directive('uiFullscreen', require('./directives/ui-fullscreen'));
// LayoutModule.directive('uiJq', require('./directives/ui-jq'));
LayoutModule.directive('uiModule', require('./directives/ui-module'));
LayoutModule.directive('uiNav', require('./directives/ui-nav'));
LayoutModule.directive('uiScroll', require('./directives/ui-scroll'));
// LayoutModule.directive('uiShift', require('./directives/ui-shift'));
LayoutModule.directive('uiToggleClass', require('./directives/ui-toggleclass'));

LayoutModule.controller('TypeaheadDemoCtrl', require('./bootstrap'));