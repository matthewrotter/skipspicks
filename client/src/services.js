(function() {

  angular.module('skipspicks')

    .constant('Config', SkipsPicks.inject('Config'))

    .factory('MapService', ['$rootScope', 'ContextService', 'Config', function($rootScope, ContextService, Config) {
      $rootScope.getDetail = function(loc) {
        console.log('GETD', loc);
      };

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
                content = '<b>' + loc.name + '</b>'
                ;
              markers.push(marker);
              marker.bindPopup(content); // .openPopup();
              marker.on('click', function() {
                $rootScope.templateUrl = 'partials/location-detail.html';

                $rootScope.Location = loc;
                ContextService.swap();

                $rootScope.$apply();
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

    .factory('ContextService', [function() {
      var menu = {
        // BEER: I'm sure this is super jank
        swap: function swap() {
          var self = this;
          var menu = angular.element(document.querySelector('#context'));
          if (menu.hasClass('show')) {
            var tend = function tend() {
              menu[0].removeEventListener('transitionend', tend);
              self.show();
            };
            menu[0].addEventListener('transitionend', tend);
            this.hide();
          } else {
            this.show();
          }
        },
        switchOrientation: function(degree) {
          var menu = angular.element(document.querySelector('#context'));
          if (degree === 0) {
            menu.removeClass('landscape');
            menu.addClass('portrait');
          } else {
            menu.removeClass('portrait');
            menu.addClass('landscape');
          }
        }
      };

      menu.full = function full() {
        var menu = angular.element(document.querySelector('#context'));
        menu.addClass('full');
      };

      menu.show = function show() {
        var menu = angular.element(document.querySelector('#context'));
        menu.addClass('show');
      };

      menu.hide = function hide() {
        var menu = angular.element(document.querySelector('#context'));
        menu.removeClass('show');
        menu.removeClass('full');
      };

      menu.toggle = function toggle() {
        var menu = angular.element(document.querySelector('#context'));
        menu.toggleClass('show');
      };

      return menu;

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