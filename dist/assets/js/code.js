(function() {

  angular.module('skipspicks', []);

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

}());
;(function() {

  angular.module('skipspicks')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'assets/partials/main.html',
          controller: 'main'
        }).
        otherwise({redirectTo: '/'});
    }]);

})();;(function() {

  angular.module('skipspicks').controller('main', ['$scope', function($scope) {

  }]);

}());