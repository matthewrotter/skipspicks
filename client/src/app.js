(function() {

  angular.module('skipspicks', ['slideout']);

  angular.module('skipspicks').run(['$rootScope', function($rootScope) {

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

  }]);

  // for lack of a better place, window options for mobile web like orientation and scrolltop
  window.addEventListener("orientationchange", function() {
    // Announce the new orientation number
    alert(window.orientation);
  }, false);

}());
