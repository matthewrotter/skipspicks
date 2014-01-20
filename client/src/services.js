(function() {

  angular.module('skipspicks')

    .constant('Config', SkipsPicks.inject('Config'))

    .factory('MapService', ['Config', function(Config) {

      var coords = Config.geo.initial, // [45.523728, -122.677988]
        markers = [],
        service = {
          init: function() {
            L.Icon.Default.imagePath = 'assets/img/leaflet';

            this.map = L.map('map', {
              zoomControl: false
            }).setView(coords, 13);

            this.map.addControl(L.control.zoom({position: 'bottomleft'}));

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
              maxZoom: 18
            }).addTo(this.map);
          },
          addMarkers: function(locations) {
            var self = this;

            this.clearMarkers();

            locations.forEach(function(loc) {
              // BEER: DRY this out, both marker and success/error and error-check
              var marker = L.marker([loc.lat, loc.lng]).addTo(self.map),
                content = '<b><a href="" ng-click="getDetail(loc)">Name: ' + loc.name + '</a></b>'
                ;
              markers.push(marker);
              marker.bindPopup(content); // .openPopup();
              marker.on('click', function() {
                /*
                 $rootScope.templateUrl = 'partials/location-detail.html';

                 $rootScope.Location = loc;
                 $menu.swap();
                 $rootScope.$apply();
                 */
              });
            });
          },
          clearMarkers: function() {
            var self = this;
            markers.forEach(function(m) {
              self.map.removeLayer(m); // BEER: improve
            });
            markers = [];
          }
        };

      service.init();

      return service;
    }])

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