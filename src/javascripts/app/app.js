require('es6-promise').polyfill(); // for IE

require('./core/core.module');
require('./crud/crud.module');
require('./dashboard/dashboard.module');
require('./filters/filters.module');
require('./layout/layout.module');

import Factory from 'admin-config/lib/Factory';

var factory = angular.module('AdminDescriptionModule', []);
factory.constant('AdminDescription', new Factory());

var app = angular.module('rdApp', [
    'ui.select',
    'AdminDescriptionModule',
    'app.core',
    'app.crud',
    'app.dashboard',
    'app.filters',
    'app.layout'
]);
app.config(function (NgAdminConfigurationProvider, AdminDescription) {
    NgAdminConfigurationProvider.setAdminDescription(AdminDescription);
});

app.config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});

// Admin definition
app.config(['NgAdminConfigurationProvider', function (NgAdminConfigurationProvider) {
    var nga = NgAdminConfigurationProvider;

    function truncate(value) {
        if (!value) {
            return '';
        }

        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    }

    var admin = nga.application('ng-admin backend demo') // application main title
        .debug(false) // debug disabled
        .baseApiUrl('http://198.50.220.167:3000/api/'); // main API endpoint

    // define all entities at the top to allow references between them
    var patient = nga.entity('Patients');
    var medication = nga.entity('MedicationAdministrations');
    var appointment = nga.entity('Appointments');
    var encounter = nga.entity('Encounters');
    var allergy = nga.entity('AllergyIntolerances');

    /**
     * Build a LoopBack property definition from the JSON model
     * @param {Object} schema JSON Schema
     * @param {Object} jsonModel The json model definition
     * @param {String} propertyName The property name
     * @returns {Object}
     */
    function buildProperty(nga, jsonModel, propertyName) {
        var jsonProperty = jsonModel.properties[propertyName];
        var property;

        if (jsonProperty.type === 'array' && jsonProperty.items) {
            property = nga.field(propertyName, 'embedded_list').targetFields(
                buildModel(nga, jsonProperty.items));
        } else if (jsonProperty.type === 'object') {
            property = nga.field(propertyName);
        } else {
            property = nga.field(propertyName, jsonProperty.type);
        }


        // if (Array.isArray(jsonModel.required) &&
        //     jsonModel.required.indexOf(propertyName) !== -1) {
        //     property.required = true;
        // }
        // for (var a in jsonProperty) {
        //     if (a === 'items' || (a in property)) {
        //         continue;
        //     }
        //     property[a] = jsonProperty[a];
        // }
        return property;
    }

    function buildModel(nga, jsonModel) {

        if (jsonModel.type && jsonModel.type !== 'object') {
            // The model is either an array or primitive type
            return;
        }
        var model = [];

        /* eslint-disable one-var */
        for (var p in jsonModel.properties) {
            var property = buildProperty(nga, jsonModel, p);
            model.push(property);
        }
        return model;
    }


    admin
        .addEntity(patient)
        .addEntity(medication)
        .addEntity(appointment)
        .addEntity(encounter)
        .addEntity(allergy);

    medication.listView().fields([
        nga.field('id').label('id')
    ]).listActions(['show', 'edit', 'delete']);
    medication.creationView()
        .fields([]);
    medication.showView()
        .fields([
            medication.creationView().fields()
        ]);

    appointment.listView().fields([
        nga.field('id').label('id')
    ]).listActions(['show', 'edit', 'delete']);
    appointment.creationView()
        .fields([]);
    appointment.showView()
        .fields([
            appointment.creationView().fields()
        ]);


    patient.listView()
        .title('All Patients') // default title is "[Entity_name] list"
        .description('List of posts with infinite pagination') // description appears under the title
        .infinitePagination(true) // load pages as the user scrolls
        .fields([
            nga.field('id').label('id'),
            nga.field('photo').label('photo').template('<img ng-src="data:{{ entry.values.photo[0].contentType }};base64,{{ entry.values.photo[0].data }}" />'),
            nga.field('gender').label('gender').template('<a href="#" editable-text="entry.values.gender">{{ entry.values.gender || "empty" }}</a>'),
            nga.field('name').label('name').map(function truncate(value, entry) {
                return value[0].family + ' ' + value[0].given;
            })
        ])
        .filters([
        ])
        .listActions(['show', 'edit', 'delete'])
        .entryCssClasses(function (entry) { // set row class according to entry
            return (entry.views > 300) ? 'is-popular' : '';
        })
        .exportFields([
            patient.listView().fields()
        ])
        .exportOptions({
            quotes: true,
            delimiter: ';'
        });

    patient.creationView()
        .fields([]);

    patient.editionView()
        .title('Edit post "{{ entry.values.id }}"') // title() accepts a template string, which has access to the entry
        .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
        .fields([
            patient.creationView().fields() // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
        ]);

    patient.showView() // a showView displays one entry in full page - allows to display more data than in a a list
        .fields([
            patient.creationView().fields(),
            nga.field('photo').label('photo').template('<img ng-src="data:{{ entry.values.photo[0].contentType }};base64,{{ entry.values.photo[0].data }}" />')
        ]);


    // customize header
    var customHeaderTemplate =
        '<div class="navbar-header">' +
        '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '</button>' +
        '<a class="navbar-brand" href="#" ng-click="appController.displayHome()">ng-admin backend demo</a>' +
        '</div>' +
        '<p class="navbar-text navbar-right hidden-xs">' +
        '<a href="https://github.com/marmelab/ng-admin/blob/master/examples/blog/config.js"><span class="glyphicon glyphicon-sunglasses"></span>&nbsp;View Source</a>' +
        '</p>';
    admin.header(customHeaderTemplate);

    // customize menu
    admin.menu(nga.menu()
        .addChild(nga.menu(patient).icon('<span class="glyphicon glyphicon-user"></span>'))
        .addChild(nga.menu(medication).icon('<span class="glyphicon glyphicon-user"></span>'))
        .addChild(nga.menu(appointment).icon('<span class="glyphicon glyphicon-user"></span>'))
        .addChild(nga.menu(encounter).icon('<span class="glyphicon glyphicon-user"></span>'))
        .addChild(nga.menu(allergy).icon('<span class="glyphicon glyphicon-user"></span>'))
    );

    // customize dashboard
    var customDashboardTemplate =
        '<div class="row dashboard-starter"></div>' +
        '<div class="row dashboard-content"><div class="col-lg-12"><div class="alert alert-info">' +
        'Welcome to the demo! Fell free to explore and modify the data. We reset it every few minutes.' +
        '</div></div></div>' +
        '<div class="row dashboard-content">' +
        '<div class="col-lg-12">' +
        '<div class="panel panel-default">' +
        '<ma-dashboard-panel collection="dashboardController.collections.comments" entries="dashboardController.entries.comments" datastore="dashboardController.datastore"></ma-dashboard-panel>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="row dashboard-content">' +
        '<div class="col-lg-6">' +
        '<div class="panel panel-green">' +
        '<ma-dashboard-panel collection="dashboardController.collections.recent_posts" entries="dashboardController.entries.recent_posts" datastore="dashboardController.datastore"></ma-dashboard-panel>' +
        '</div>' +
        '<div class="panel panel-green">' +
        '<ma-dashboard-panel collection="dashboardController.collections.popular_posts" entries="dashboardController.entries.popular_posts" datastore="dashboardController.datastore"></ma-dashboard-panel>' +
        '</div>' +
        '</div>' +
        '<div class="col-lg-6">' +
        '<div class="panel panel-yellow">' +
        '<ma-dashboard-panel collection="dashboardController.collections.tags" entries="dashboardController.entries.tags" datastore="dashboardController.datastore"></ma-dashboard-panel>' +
        '</div>' +
        '</div>' +
        '</div>';
    admin.dashboard(nga.dashboard()
        .addCollection(nga.collection(patient)
            .name('recent_posts')
            .title('Recent posts')
            .perPage(5) // limit the panel to the 5 latest posts
            .fields([
                nga.field('published_at', 'date').label('Published').format('MMM d'),
                nga.field('title').isDetailLink(true).map(truncate),
                nga.field('views', 'number')
            ])
            .sortField('published_at')
            .sortDir('DESC')
            .order(1)
        )
        .addCollection(nga.collection(patient)
            .name('popular_posts')
            .title('Popular posts')
            .perPage(5) // limit the panel to the 5 latest posts
            .fields([
                nga.field('published_at', 'date').label('Published').format('MMM d'),
                nga.field('title').isDetailLink(true).map(truncate),
                nga.field('views', 'number')
            ])
            .sortField('views')
            .sortDir('DESC')
            .order(3)
        )
        .template(customDashboardTemplate)
    );
    nga.configure(admin);
}]);