(function() {

  angular.module('skipspicks').controller('main', ['$scope', '$http', function($scope, $http) {

    var coords = [45.523728, -122.677988];

    L.Icon.Default.imagePath = 'assets/img/leaflet';

    var map = L.map('map').setView(coords, 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    }).addTo(map);


    // get locations
    $http.get('http://localhost:4001/api/v1/location')
      .success(function(result) {
        console.log('R', result);

        result.forEach(function(loc) {
          var marker = L.marker([loc.lat, loc.lng]).addTo(map),
            content = '<b>Name: ' + loc.name + '</b>'
            ;
          marker.bindPopup(content).openPopup();
        });
      })
      .error(function(err) {

      });

  }]);

}());