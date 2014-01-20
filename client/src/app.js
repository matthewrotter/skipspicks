(function() {

  angular.module('skipspicks', ['ngRoute', 'slideout', 'ngTagsInput']);

  angular.module('skipspicks').run(['$rootScope', '$menu', function($rootScope, $menu) {

    $rootScope.empty = function(value) {
      return _.isEmpty(value);
    };

    // $rootScope.$on('$routeChangeStart', function(scope, newRoute) { });
    // $rootScope.$on('$viewContentLoaded', function(){ });

    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    // for lack of a better place, window options for mobile web like orientation and scrolltop
    if (window.innerWidth > window.innerHeight) {
      $menu.switchOrientation(90);
    }
    window.addEventListener("orientationchange", function() {
      $menu.switchOrientation(window.orientation);
    }, false);
    window.addEventListener("resize", function() {
      $menu.switchOrientation(window.orientation);
    }, false);

  }]);

}());
