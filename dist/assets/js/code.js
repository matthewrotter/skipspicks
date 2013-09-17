(function() {

  angular.module('skipspicks', ['slideout']);

  angular.module('skipspicks').run(['$rootScope', function($rootScope) {

    $rootScope.empty = function(value) {
      return _.isEmpty(value);
    };

    // $rootScope.$on('$routeChangeStart', function(scope, newRoute) { });
    // $rootScope.$on('$viewContentLoaded', function(){ });

    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

  }]);

}());
;(function() {

  angular.module('skipspicks')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'assets/partials/main.html',
          controller: 'main'
        }).
        otherwise({redirectTo: '/'});
    }]);

})();;(function() {

  angular.module('skipspicks').controller('main', ['$scope', function($scope) {


    // move to a directive
    function success() {
    }

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords,
        coords = [crd.latitude, crd.longitude];

      L.Icon.Default.imagePath = 'assets/img/leaflet';

      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude);

      var map = L.map('map').setView(coords, 13);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(map);

      var marker = L.marker(coords).addTo(map);

      var circle = L.circle(coords, 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
      }).addTo(map);

      var polygon = L.polygon([
        coords.map(function(c) {
          return c + .01
        }),
        coords.map(function(c) {
          return c - .01
        }),
        [coords[0], coords[1] + .01]
      ]).addTo(map);

      marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
      circle.bindPopup("I am a circle.");
      polygon.bindPopup("I am a polygon.");

      map.on('click', function(e) {
        console.log(e);
      });

      function onMapClick(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
      }

      map.on('click', onMapClick);

    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }]);

}());