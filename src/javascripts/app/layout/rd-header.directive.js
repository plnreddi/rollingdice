import headerView from './header.html';

export default function rdHeader($location, $rootScope, $compile) {
    return {
        link: function(scope, element) {},
        template: headerView

    };
}

rdHeader.$inject = ['$location', '$rootScope', '$compile'];
