(function() {

  angular.module('skipspicks')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'partials/main.html',
          controller: 'main'
        }).
        otherwise({redirectTo: '/'});
    }]);

})();