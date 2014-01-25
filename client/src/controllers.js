(function() {

  angular.module('skipspicks').controller('AddReviewController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    $scope.Review = {
      rating: 1
    };

    $scope.save = function() {
      console.log('addrevsave', $scope.Location);

      // BEER: move to service
      $http.post('http://localhost:4001/api/v1/location/' + $scope.Location._id + '/review', $scope.Review)
        .success(function(result) {
          console.log('SAVED', result);
        })
        .error(function(err) {
          console.log('Error', err);
        });
    };
  }]);


  angular.module('skipspicks').controller('EstablishLocationController', ['$scope', '$rootScope', 'GeoService', 'ContextService', function($scope, $rootScope, GeoService, ContextService) {
    $scope.Establish = {};

    $scope.lookup = function() {
      GeoService.geocode($scope.Establish.address, function(result) {
        $scope.matches = result.results.slice(0, 3);
      });
    };
    $scope.clear = function() {
      $scope.matches = null;
      $scope.Establish = {};
    };
    $scope.chooseLocation = function(loc) {
      var comps = {};
      loc.address_components.forEach(function(comp) {
        comps[comp.types[0]] = comp.short_name;
      });
      console.log('CMPS', comps);
      $rootScope.LocationEdit = {
        address: comps.street_number + ' ' + comps.route,
        city: comps.locality,
        state: comps.administrative_area_level_1,
        postalCode: comps.postal_code
      };
      $rootScope.templateUrl = 'partials/add-location.html';
      ContextService.full();
    };
  }]);


  angular.module('skipspicks').controller('ContextController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    $scope.addReview = function() {
      $rootScope.templateUrl = 'partials/add-review.html';
      ContextService.full();
    };
  }]);


  angular.module('skipspicks').controller('MainController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    // ContextService.full();
    ContextService.show();
    $rootScope.templateUrl = 'partials/establish-location.html';

    $scope.handleToggle = function() {
      ContextService.cHandleToggle();
    };

    // form setup/set defaults
    $rootScope.LocationEdit = {
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
      $rootScope.LocationEdit.details = _.map($scope.selectedDetails, function(val, key) {
        return val;
      });

      console.log('mainctrlsave', $rootScope.LocationEdit.details, $rootScope.LocationEdit);
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

    $rootScope.showEstablishLocation = function() {
      $rootScope.templateUrl = 'partials/establish-location.html';
      ContextService.show();
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


  angular.module('skipspicks').controller('SearchController', ['$scope', '$rootScope', '$http', '$q', 'LocationRestService', 'MapService', 'ContextService', 'ConfigService', function($scope, $rootScope, $http, $q, LocationRestService, MapService, ContextService, ConfigService) {
    var keywords = [];

    ConfigService.async().then(function(result) {
      // BEER: move to config, js or mongo
      ['cuisines', 'details', 'prices', 'ratings', 'types'].forEach(function(cat) {
        keywords = keywords.concat(result[cat]);
      });
    });

    $rootScope.tags = ['Restaurant', 'Bar'];

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
      ContextService.hide();
      var filter = {
        tags: $rootScope.tags,
        bounds: MapService.getBounds()
      };
      LocationRestService.getLocationsByFilter(filter)
        .success(function(result) {
          MapService.addMarkers(result);
        })
        .error(function(err) {
          console.log('Error', err);
        });
    };

  }]);


  angular.module('skipspicks').controller('MapController', ['$scope', '$rootScope', '$http', 'LocationRestService', 'ContextService', 'MapService', 'GeoService', function($scope, $rootScope, $http, LocationRestService, ContextService, MapService, GeoService) {
    var map = MapService.map;

    // move to user's location
    GeoService.locate(function(pos) {
      var crd = pos.latlng,
        coords = [crd.latitude, crd.longitude];

      GeoService.reverseGeocode(coords, function(result) {
        var parse = {};
        result.results.forEach(function(addressInfo) {
          parse[addressInfo.types[0]] = addressInfo.formatted_address;
        });
        $rootScope.geolocation = parse;
      });

      map.setView(coords, 15);

      map.on('focus dragstart click', function() {
        ContextService.hide();
      });

      map.on('moveend', function(distance) {
        console.log('D', distance);

        var filter = {
          tags: $rootScope.tags,
          bounds: MapService.getBounds()
        };
        LocationRestService.getLocationsByFilter(filter)
          .success(function(result) {
            MapService.addMarkers(result);
          })
          .error(function(err) {
            console.log('Error', err);
          });
      });
    });

    // get locations
    LocationRestService.getLocations()
      .success(function(result) {
        MapService.addMarkers(result);
      })
      .error(function(err) {
        console.log('Error', err);
      });


  }]);

}());