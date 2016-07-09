/**
 * @param {$scope}  $scope
 * @param {$state}  $state
 * @param {NgAdmin} Configuration
 * @constructor
 */
export default class AppController {
    constructor($scope, $state, Configuration) {
        var application = Configuration();
        this.$scope = $scope;
        this.$state = $state;
        this.$scope.isCollapsed = true;
        this.menu = application.menu();
        this.applicationName = application.title();
        this.header = application.header();

        // config
        $scope.app = {
            name: 'Angulr',
            version: '2.2.0',
            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 1,
                navbarHeaderColor: 'bg-black',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-black',
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false
            }
        }

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    displayHome() {
        this.$state.go(this.$state.get('dashboard'));
    }

    destroy() {
        this.$scope = undefined;
        this.$state = undefined;
    }
}

AppController.$inject = ['$scope', '$state', 'NgAdminConfiguration'];
