import angular from 'angular';

require('angular-ui-router');
require('restangular');

var CoreModule = angular.module('app.core', ['ui.router', 'restangular', 'pascalprecht.translate']);

CoreModule.controller('AppController', require('./AppController'));

CoreModule.provider('NgAdminConfiguration', require('./NgAdminConfiguration'));

CoreModule.config(require('./config/http'));
CoreModule.config(require('./config/routing'));
CoreModule.config(require('./config/translate'));

CoreModule.run(require('./run/ErrorHandler'));
CoreModule.run(require('./run/Loader'));
