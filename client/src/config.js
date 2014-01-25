(function() {
  "use strict";

  SkipsPicks.service({
    name: 'Config',
    dependencies: [],
    extension: SkipsPicks.Manager,
    factory: function() {
      var result;

      if (typeof Config === 'undefined') {
        // console.log('WARNING: CONFIG IS NOT SET');
        result = {
          service: {
            host: /*! HOST */'http://localhost:4001',
            endpoints: {
              location: '/api/v1/location',
              locationFilter: '/api/v1/location/filter',
              locationsByGeo: '/api/v1/location/geo',
              config: '/api/v1/config',
              places: '/api/v1/places'
            }
          },
          api: {
            geocode: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true'
          },
          geo: {
            initial: [45.523728, -122.677988]
          }
        };
      } else {
        result = Config;
      }

      return result;
    }
  });

}());
