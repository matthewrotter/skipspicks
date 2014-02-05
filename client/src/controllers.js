(function() {

  angular.module('skipspicks').controller('SettingsController', ['$scope', '$rootScope', 'ContextService', 'snapRemote', function($scope, $rootScope, ContextService, snapRemote) {
//    snapRemote.open('right');

    $scope.addTag = function(tag) {
      $rootScope.tags.push(tag);
      $rootScope.tagSearch();
      snapRemote.close();
    };

    $scope.used = function(item) {
      return _.contains($rootScope.tags, item);
    };

    $scope.showEstablishLocation = function() {
      snapRemote.close();
      $rootScope.templateUrl = 'partials/establish-location.html';
      ContextService.show();
    };

    snapRemote.getSnapper().then(function(snapper) {
      snapper.on('open', function() {
        ContextService.hide();
      });

      /*
       snapper.on('close', function() {
       });
       */
    });
  }]);


  angular.module('skipspicks').controller('AddReviewController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    $scope.Review = {
      rating: 1
    };

    $scope.save = function() {
      console.log('addrevsave', $scope.Location);

      // BEER: move to service
      $http.post(Config.service.host + Config.service.endpoints.location + '/' + $scope.Location._id + '/review', $scope.Review)
        .success(function(result) {
          alert('SAVED');
          ContextService.hide();
          console.log('SAVED', result);
        })
        .error(function(err) {
          console.log('Error', err);
        });
    };
  }]);


  angular.module('skipspicks').controller('EstablishLocationController', ['$scope', '$rootScope', 'GeoService', 'LocationRestService', 'ContextService', function($scope, $rootScope, GeoService, LocationRestService, ContextService) {
    $scope.Establish = {};

    // BEER: not DRY
    LocationRestService.findPlaces(GeoService.location)
      .success(function(result) {
        console.log('GoogPlace', result);
        $scope.matches = result.results.slice(0, 3);
      })
      .error(function(err) {
        console.log('Error', err);
      });


    // BEER: handle this in directive or better
    $scope.blur = function() {
      document.getElementById('establishName').blur();
      document.getElementById('establishAddress').blur();
    };

    $scope.lookupByAddress = function() {
      GeoService.geocode($scope.Establish.address, function(result) {
        console.log('GoogGeoc', result);
        $scope.matches = result.results.slice(0, 3);
      });
    };

    $scope.lookupByName = function() {
      LocationRestService.findPlaces(GeoService.location, $scope.Establish.name)
        .success(function(result) {
          console.log('GoogPlace', result);
          $scope.matches = result.results.slice(0, 3);
        })
        .error(function(err) {
          console.log('Error', err);
        });
    };

    $scope.clear = function() {
      $scope.matches = null;
      $scope.Establish = {};
    };

    $scope.chooseLocation = function(loc) {
      var addr = loc.formatted_address || loc.vicinity;
      var comps = addr.split(', '),
        subcomp = comps[2] ? comps[2].split(' ') : [];
      console.log('ChLoc', loc);
      $rootScope.LocationEdit = {
        name: loc.name,
        address: comps[0],
        city: comps[1],
        state: subcomp[0],
        postalCode: subcomp[1],
        lat: loc.geometry.location.lat,
        lng: loc.geometry.location.lng,

        price: '$',
        reviews: [
          {
            rating: 1
          }
        ],
        type: ['Bar'] // BEER: remove hardcoding!!
      };
      $rootScope.templateUrl = 'partials/add-location.html';
      ContextService.full();
    };
  }]);


  angular.module('skipspicks').controller('LocationDetailController', ['$scope', '$rootScope', '$http', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, ContextService, ConfigService, Config) {
    $scope.addReview = function() {
      $rootScope.templateUrl = 'partials/add-review.html';
      ContextService.full();
    };
  }]);


  angular.module('skipspicks').controller('MainController', ['$scope', '$rootScope', '$http', 'LocationRestService', 'ContextService', 'ConfigService', 'Config', function($scope, $rootScope, $http, LocationRestService, ContextService, ConfigService, Config) {
    /*
     ContextService.full();
     ContextService.show();
     $rootScope.templateUrl = 'partials/add-location.html';
     */
    $scope.settingsTemplateUrl = 'partials/settings.html';

    // BEER: this should go somewhere at init time
    ConfigService.async().then(function(result) {
      $rootScope.Config = {
        ratings: _.map(result.ratings, function(r) {
          return parseInt(r, 10);
        }),
        details: result.details,
        prices: result.prices,
        cuisines: result.cuisines
      };
    });


    $scope.snapOptions = {
      disable: 'left',
      minPosition: -265
    };

    $scope.handleToggle = function() {
      ContextService.cHandleToggle();
    };

    // form setup/set defaults
    $rootScope.LocationEdit = {
      // name: 'Shitbird',
      price: '$',
      reviews: [
        {
          rating: 1
        }
      ]
    };

    $scope.selectedDetails = {};
    // /form setup

    $scope.save = function() {
      // pick out the details
      $rootScope.LocationEdit.details = _.map($scope.selectedDetails, function(val, key) {
        return val;
      });

      console.log('mainctrlsave', $rootScope.LocationEdit);

      LocationRestService.createLocation($rootScope.LocationEdit)
        .success(function(result) {
          console.log('LOCSAVED', result);
          ContextService.hide();
          alert('SAVED');
        })
        .error(function(err) {
          console.log('Error', err);
        });
      // alert('Not Implemented yet...');
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

    $rootScope.hideEditor = function() {
      ContextService.hide();
    };

    $rootScope.showSettings = function() {
      $rootScope.templateUrl = 'partials/settings.html';
      ContextService.toggle();
    };
  }]);


  angular.module('skipspicks').controller('SearchController', ['$scope', '$rootScope', '$http', '$q', 'LocationRestService', 'MapService', 'ContextService', 'ConfigService', function($scope, $rootScope, $http, $q, LocationRestService, MapService, ContextService, ConfigService) {
    var keywords = [];

    $scope.try = function() {
      console.log('clicked in box...');
    };

    ConfigService.async().then(function(result) {
      // BEER: move to config, js or mongo
      ['cuisines', 'details', 'prices', 'ratings', 'types'].forEach(function(cat) {
        keywords = keywords.concat(result[cat]);
      });
    });

    $rootScope.tags = []; // ['Restaurant', 'Bar'];

    $scope.loadTags = function(query) {
      var deferred = $q.defer(),
        regexp = new RegExp(query, 'i');

      // massage this into a big ol' list of matches; could probably use built-in ng filter?...
      var filtered = _.filter(keywords, function(item) {
        return item.match(regexp);
      });
      filtered = _.union(['Restaurant', 'Bar'], filtered);
      console.log('FGG', filtered);
      deferred.resolve(filtered);

      return deferred.promise;
    };

    $rootScope.tagSearch = function() {
      // document.querySelector('input[type="search"]').blur();
      // document.getElementById('establishName').blur();
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

      GeoService.location = coords; // setting global usage

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
        var center = map.getCenter(),
          latlng = [center.lat, center.lng];
        console.log('D', distance, latlng);
        GeoService.location = latlng;

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
