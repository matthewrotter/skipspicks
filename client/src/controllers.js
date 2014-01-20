(function() {

  angular.module('skipspicks').controller('FloatController', ['$scope', '$rootScope', '$menu', 'ConfigService', function($scope, $rootScope, $menu, ConfigService) {
    ConfigService.async().then(function(d) {
      $rootScope.Config = d;
    });

    $scope.showSearch = function() {
      console.log('CC', $scope.Config);

      $rootScope.templateUrl = 'partials/search.html';
      $menu.show();
    };

  }]);

  angular.module('skipspicks').controller('main', ['$scope', '$rootScope', '$http', '$menu', 'GeoService', 'Config', function($scope, $rootScope, $http, $menu, GeoService, Config) {

    var coords = [45.523728, -122.677988], // BEER: move to config
      markers = [];

    L.Icon.Default.imagePath = 'assets/img/leaflet';

    var map = L.map('map').setView(coords, 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    }).addTo(map);

    // move to user's location
    GeoService.locate(function(pos) {
      var crd = pos.latlng,
        coords = [crd.latitude, crd.longitude];

      map.setView(coords, 15);

      map.on('focus dragstart click', function() {
        $menu.hide();
      });

      map.on('moveend', function(distance) {
        markers.forEach(function(m) {
          map.removeLayer(m);
        });
        markers = [];

        var bounds = map.getBounds(),
          set = [bounds._southWest.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._northEast.lng],
          path = set.join('/');

        $http.get(Config.service.host + Config.service.endpoints.locationsByGeo + '/' + path)
          .success(function(result) {
            console.log('R', result.length);

            result.forEach(function(loc) {
              // BEER: DRY this out, both marker and success/error and error-check
              var marker = L.marker([loc.lat, loc.lng]).addTo(map),
                content = '<b><a href="" ng-click="getDetail(loc)">Name: ' + loc.name + '</a></b>'
                ;
              markers.push(marker);
              marker.bindPopup(content); // .openPopup();
              marker.on('click', function() {
                $rootScope.templateUrl = 'partials/location-detail.html';

                $rootScope.Location = loc;
                $menu.swap();
                $rootScope.$apply();
              });
            });
          })
          .error(function(err) {

          });
      });
    });

    // get locations
    $http.get(Config.service.host + Config.service.endpoints.location + '?limit=10')
      .success(function(result) {
        console.log('R', result.length);

        result.forEach(function(loc) {
          var marker = L.marker([loc.lat, loc.lng]).addTo(map),
            content = '<b>Name: ' + loc.name + '</b>'
            ;
          markers.push(marker);
          marker.bindPopup(content); // .openPopup();
        });
      })
      .error(function(err) {

      });


  }]);

}());