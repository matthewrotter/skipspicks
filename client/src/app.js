(function() {

  angular.module('skipspicks', ['ngTagsInput', 'snap']);

  angular.module('skipspicks').run(['$rootScope', 'ContextService', function($rootScope, ContextService) {

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

    /*
     // for lack of a better place, window options for mobile web like orientation and scrolltop
     if (window.innerWidth > window.innerHeight) {
     ContextService.switchOrientation(90);
     }
     window.addEventListener("orientationchange", function() {
     ContextService.switchOrientation(window.orientation);
     }, false);
     window.addEventListener("resize", function() {
     ContextService.switchOrientation(window.orientation);
     }, false);
     */

  }]);

}());
