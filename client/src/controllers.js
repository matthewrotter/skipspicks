(function() {

  angular.module('skipspicks').controller('MainController', ['$scope', '$rootScope', 'ContextService', 'Config', function($scope, $rootScope, ContextService, Config) {
    $rootScope.showEditor = function() {
      $rootScope.templateUrl = 'partials/editor.html';
      ContextService.full();
    };
    $rootScope.hideEditor = function() {
      ContextService.hide();
    };

    $rootScope.showSettings = function() {
      $rootScope.templateUrl = 'partials/settings.html';
      ContextService.show();
    };
  }]);


  angular.module('skipspicks').controller('SearchController', ['$scope', '$http', '$q', 'MapService', 'ConfigService', 'Config', function($scope, $http, $q, MapService, ConfigService, Config) {
    var config = ['restaurant', 'bar'];

    ConfigService.async().then(function(result) {
      // BEER: move to config, js or mongo
      ['cuisines', 'details', 'prices', 'ratings', 'types'].forEach(function(cat) {
        config = config.concat(result[cat]);
      });
    });

    $scope.tags = config;

    $scope.loadTags = function(query) {
      var deferred = $q.defer(),
        regexp = new RegExp(query, 'i');

      // massage this into a big ol' list of matches; could probably use built-in ng filter?...
      var filtered = _.filter(config, function(item) {
        return item.match(regexp);
      });
      deferred.resolve(filtered);

      return deferred.promise;
    };

    $scope.search = function() {
      console.log('S', $scope.tags);
      $http.post(Config.service.host + Config.service.endpoints.locationFilter, $scope.tags)
        .success(function(result) {
          console.log('PF', result);
          MapService.addMarkers(result);
        });
    };

  }]);

  angular.module('skipspicks').controller('MapController', ['$scope', '$rootScope', '$http', 'ContextService', 'MapService', 'GeoService', 'Config', function($scope, $rootScope, $http, ContextService, MapService, GeoService, Config) {
    var map = MapService.map;

    // move to user's location
    GeoService.locate(function(pos) {
      var crd = pos.latlng,
        coords = [crd.latitude, crd.longitude];

      map.setView(coords, 15);

      map.on('focus dragstart click', function() {
        ContextService.hide();
      });

      map.on('moveend', function(distance) {
        var bounds = map.getBounds(),
          set = [bounds._southWest.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._northEast.lng],
          path = set.join('/');

        $http.get(Config.service.host + Config.service.endpoints.locationsByGeo + '/' + path)
          .success(function(result) {
            // $rootScope.locations = result;
            MapService.addMarkers(result);
          })
          .error(function(err) {
            console.log('Error', err);
          });
      });
    });

    // get locations
    $http.get(Config.service.host + Config.service.endpoints.location + '?limit=10')
      .success(function(result) {
        MapService.addMarkers(result);
      })
      .error(function(err) {
        console.log('Error', err);
      });


  }]);

}());