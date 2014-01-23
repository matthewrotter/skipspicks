(function() {

  angular.module('skipspicks').controller('ContextController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    $scope.addReview = function(loc) {
      console.log('addR', loc);
    };
  }]);


  angular.module('skipspicks').controller('MainController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    /*
     ContextService.full();
     ContextService.show();
     $rootScope.templateUrl = 'partials/editor.html';
     */

    // form setup/set defaults
    $scope.LocationEdit = {
      // name: 'Shitbird',
      price: '$',
      review: {
        rating: 1
      }
    };

    ConfigService.async().then(function(result) {
      $scope.ratings = _.map(result.ratings, function(r) {
        return parseInt(r, 10);
      });
      $scope.details = result.details;
      $scope.prices = result.prices;
    });
    $scope.selectedDetails = {};
    // /form setup

    $scope.save = function() {
      // pick out the details
      $scope.LocationEdit.details = _.map($scope.selectedDetails, function(val, key) {
        return val;
      });

      console.log('LL', $scope.LocationEdit.details, $scope.LocationEdit);
    };

    /*
     // retrieve existing on update
     $http.get(Config.service.host + Config.service.endpoints.location + '/52db0e68053794ea7b000003')
     .success(function(result) {
     console.log('RR', result);
     $scope.Location = result[0];

     $scope.selectedDetails = {};
     $scope.Location.details.forEach(function(detail) {
     $scope.selectedDetails[detail] = detail;
     });
     });
     // 52db0e68053794ea7b000003
     */

    $rootScope.showEditor = function() {
      $rootScope.templateUrl = 'partials/editor.html';
      ContextService.full();
    };
    $rootScope.hideEditor = function() {
      console.log('HIDE');
      ContextService.hide();
    };

    $rootScope.showSettings = function() {
      $rootScope.templateUrl = 'partials/settings.html';
      ContextService.toggle();
    };
  }]);


  angular.module('skipspicks').controller('SearchController', ['$scope', '$http', '$q', 'MapService', 'ConfigService', 'Config', function($scope, $http, $q, MapService, ConfigService, Config) {
    var keywords = [];

    ConfigService.async().then(function(result) {
      // BEER: move to config, js or mongo
      ['cuisines', 'details', 'prices', 'ratings', 'types'].forEach(function(cat) {
        keywords = keywords.concat(result[cat]);
      });
    });

    $scope.tags = ['Restaurant', 'Bar'];

    $scope.loadTags = function(query) {
      var deferred = $q.defer(),
        regexp = new RegExp(query, 'i');

      // massage this into a big ol' list of matches; could probably use built-in ng filter?...
      var filtered = _.filter(keywords, function(item) {
        return item.match(regexp);
      });
      deferred.resolve(filtered);

      return deferred.promise;
    };

    $scope.search = function() {
      console.log('S', $scope.tags);
      $http.post(Config.service.host + Config.service.endpoints.locationFilter, $scope.tags)
        .success(function(result) {
          // console.log('PF', result);
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
        console.log('D', distance);
        var bounds = map.getBounds(),
          set = [bounds._southWest.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._northEast.lng],
          path = set.join('/');

        // BEER: create LocationService
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