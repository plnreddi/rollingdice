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
        .title('Create new Poster')
        .fields([nga.field('id').validation({ required: true })
            .cssClasses('col-sm-4')]);

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

    // customize menu
    admin.menu(nga.menu()
        .addChild(nga.menu(patient).icon('<span class="glyphicon glyphicon-user"></span>')
            .addChild(nga.menu().title('Stats').link('/stats'))
            .addChild(nga.menu().title('Stats').link('/stats'))
            .addChild(nga.menu().title('Stats').link('/stats'))
        )
        .addChild(nga.menu(medication).title('Medication').icon('<span class="glyphicon glyphicon-user"></span>')
            .addChild(nga.menu().title('Stats').link('/stats'))
            .addChild(nga.menu().title('Stats').link('/stats'))
        )
        .addChild(nga.menu(appointment).icon('<span class="glyphicon glyphicon-user"></span>')
            .addChild(nga.menu().title('Stats').link('/stats'))
            .addChild(nga.menu().title('Stats').link('/stats'))
        )
        .addChild(nga.menu(encounter).icon('<span class="glyphicon glyphicon-user"></span>'))
        .addChild(nga.menu(allergy).title('Allergies').icon('<span class="glyphicon glyphicon-user"></span>'))
    );

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
            .fields(patient.listView().fields())
            .sortField('id')
            .sortDir('DESC')
            .order(3)
        )
    );
    nga.configure(admin);
}]);