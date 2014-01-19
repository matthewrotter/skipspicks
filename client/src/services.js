(function() {

  angular.module('skipspicks')

    .constant('Config', SkipsPicks.inject('Config'))

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