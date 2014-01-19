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
            host: 'http://10.0.1.210:4001',
            endpoints: {
              location: '/api/v1/location',
              locationsByGeo: '/api/v1/location/geo'
            }
          },
          api: {
          }
        };
      } else {
        result = Config;
      }

      return result;
    }
  });

}());
