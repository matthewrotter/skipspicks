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
            host: /* HOST */'http://skipspicks.jit.su',
            endpoints: {
              location: '/api/v1/location',
              locationFilter: '/api/v1/location/filter',
              locationsByGeo: '/api/v1/location/geo',
              config: '/api/v1/config'
            }
          },
          api: {
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
