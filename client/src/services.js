(function() {

  angular.module('skipspicks')

    .constant('Config', SkipsPicks.inject('Config'))

    .factory('ConfigService', ['$http', 'Config', function($http, Config) {
      console.log('CALLING CSERV');

      var promise,
        myService = {
          async: function() {
            if (!promise) {
              // $http returns a promise, which has a then function, which also returns a promise
              promise = $http.get(Config.service.host + Config.service.endpoints.config).then(function(response) {
                // The then function here is an opportunity to modify the response
                console.log('cresp', response);
                // The return value gets picked up by the then in the controller.
                return response.data;
              });
            }
            // Return the promise to the controller
            return promise;
          }
        };
      return myService;

    }])

    .factory('Utils', function() {
      return SkipsPicks.inject('Utility');
    })

    .factory('GeoService', function() {
      return SkipsPicks.inject('GeolocationService');
    })

    .factory('exceptionHandlerFactory', ['Config', 'Utils', function(Config, Utils) {

      return function(exception, cause) {
        console.warn(Utils.formatError(exception), cause);
        return;
      };

    }])
    .config(['$provide', function($provide) {
      $provide.decorator('$exceptionHandler', ['exceptionHandlerFactory', function(exceptionHandlerFactory) {
        return exceptionHandlerFactory;
      }]);
    }]);

}());