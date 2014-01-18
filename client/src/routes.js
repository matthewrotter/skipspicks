(function() {

  angular.module('skipspicks')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'assets/partials/main.html',
          controller: 'main'
        }).
        otherwise({redirectTo: '/'});
    }]);

})();