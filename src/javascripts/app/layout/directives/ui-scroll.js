export default function uiScrollTo($location, $anchorScroll) {
  return {
    restrict: 'AC',
    link: function (scope, el, attr) {
      el.on('click', function (e) {
        $location.hash(attr.uiScrollTo);
        $anchorScroll();
      });
    }
  };
};

uiScrollTo.$inject = ['$location', '$anchorScroll'];
