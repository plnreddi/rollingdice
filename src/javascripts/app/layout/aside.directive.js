import asideView from './aside.html';

export default function aside($location, $rootScope, $compile) {
    return {
        link: function(scope, element) {},
        template: asideView,
        replace: true

    };
}

aside.$inject = ['$location', '$rootScope', '$compile'];
