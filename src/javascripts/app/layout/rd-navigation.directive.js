import navigationView from './navigation.html';

export default function rdNavigation() {
    return {
        replace: true,
        link: function(scope, element) {},
        template: navigationView
    };
};