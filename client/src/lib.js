/**!
 * export the global SkipsPicks singleton
 *
 */
var SkipsPicks = (function() {
  "use strict";

  // our top-level Model object from which to extend things like User and Ticket
  function Model(id) {
    this.id = id;
  }

  function Manager(id) {
    this.id = id;
  }

  function extend(obj) {
    var args = [
      Object.create(obj.prototype),
      {
        constructor: obj
      }
    ];
    _.each(Array.prototype.slice.call(arguments, 1), function(item) {
      args.push(item);
    });

    return _.extend.apply(null, args);
  }

  /*
   * Module/dependency management
   *
   * inspired by:
   * https://github.com/maxpolun/hypospray/blob/master/example.js
   * and, maybe, this
   * http://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/
   */
  var services = {};

  function service(args) {
    services[args.name] = {
      factory: args.factory,
      dependencies: args.dependencies,
      extension: args.extension
    };
  }

  function inject(name) {
    var service = services[name];
    if (!service) {
      console.error('Service [' + name + '] is not defined');
    }
    var resolvedDependencies = [];
    for (var i = 0, l = service.dependencies && service.dependencies.length; i < l; i++) {
      resolvedDependencies.push(inject(service.dependencies[i]));
    }
    // allow over-riding dependencies in inject
    var overrides = Array.prototype.slice.call(arguments, 1);
    _.forEach(overrides, function(item, index) {
      resolvedDependencies[index] = item;
    });
    var instance = service.factory.apply(null, resolvedDependencies);
    if (typeof instance === 'function') {
      return instance;
    }

    // all services extend Manager for now
    if (service.extension) {
      instance = extend(service.extension, instance);
    }

    return instance;
  }


  /**
   * export our global object
   */
  return {
    Model: Model,
    Manager: Manager,
    service: service,
    inject: inject
  };

}());

/*
 * modules
 */
(function() {
  "use strict";

  SkipsPicks.service({
    name: 'Utility',
    dependencies: ['Config'],
    extension: SkipsPicks.Manager,
    factory: function(Config) {

      // Error-handling
      var levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
        types = ['click', 'crash', 'debug', 'error', 'message', 'pageview'];


      var retObj = {
        formatError: function(arg) {
          if (arg instanceof Error) {
            if (arg.stack) {
              arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ?
                'Error: ' + arg.message + '\n' + arg.stack :
                arg.stack;
            } else if (arg.sourceURL) {
              arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
          }
          return arg;
        },

        // dynamically add a script to page
        loadScript: function loadScript(sScriptSrc, oCallback) {
          var oHead = document.getElementsByTagName('head')[0];
          var oScript = document.createElement('script');
          oScript.src = sScriptSrc;
          oScript.onload = oCallback;
          oHead.appendChild(oScript);
        },

        // pad a string with character
        pad: function(str, char, places) {
          return '' + (char + str).slice(-places);
        },

        deepCopy: function deepCopy(source, destination) {
          if (!destination) {
            destination = source;
            if (source) {
              if (_.isArray(source)) {
                destination = deepCopy(source, []);
              } else if (_.isDate(source)) {
                destination = new Date(source.getTime());
              } else if (_.isObject(source)) {
                destination = deepCopy(source, {});
              }
            }
          } else {
            if (source === destination) {
              throw new Error("Can't copy equivalent objects or arrays");
            }
            if (_.isArray(source)) {
              destination.length = 0;
              for (var i = 0; i < source.length; i++) {
                destination.push(deepCopy(source[i]));
              }
            } else {
              _.forEach(destination, function(value, key) {
                delete destination[key];
              });
              for (var key in source) {
                destination[key] = deepCopy(source[key]);
              }
            }
          }
          return destination;
        },

        serialize: function(obj) {
          var str = [];
          _.forEach(obj, function(p) {
            str.push(encodeURIComponent(p.name) + "=" + encodeURIComponent(p.value));
          });
          return str.join("&");
        },

        // from node-gtfs
        isInt: function(n) {
          return typeof n === 'number' && n % 1 === 0;
        },

        getDayName: function(date) {
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          return days[date.getDay()];
        },

        formatDay: function(date) {
          var day = (date.getDate() < 10) ? '' + '0' + date.getDate() : date.getDate()
            , month = ((date.getMonth() + 1) < 10) ? '' + '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
            , year = date.getFullYear();
          return '' + year + month + day;
        },

        timeToSeconds: function(time) {
          if (time instanceof Date) {
            var timeParts = [ time.getHours(), time.getMinutes(), time.getSeconds() ];
          } else {
            var timeParts = time.split(':');
            if (timeParts.length != 3) {
              return null;
            }
          }
          return parseInt(timeParts[0], 10) * 60 * 60 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
        },

        secondsToTime: function(seconds) {
          //check if seconds are already in HH:MM:SS format
          if (seconds.match(/\d+:\d+:\d+/)[0]) {
            return seconds;
          }

          var hour = Math.floor(seconds / (60 * 60))
            , minute = Math.floor((seconds - hour * (60 * 60)) / 60)
            , second = seconds - hour * (60 * 60) - minute * 60;
          return ((hour < 10) ? '' + '0' + hour : hour) + ':' + ((minute < 10) ? '' + '0' + minute : minute) + ':' + ((second < 10) ? '' + '0' + second : second);
        }

      };
      return retObj;
    }

  });


  SkipsPicks.service({
    name: 'GeolocationService',
    dependencies: [],
    extension: SkipsPicks.Manager,
    factory: function() {
      // inspired by Leaf's simple geo helpers

      var options = {
          timeout: 5000,
          maximumAge: 60000,
          enableHighAccuracy: false // this so doesn't time out trying
        },
        latDivisor = 40075017,
        lonDivisor = Math.PI / 180;


      // API
      return {
        // over-ride the service defaults (above) for geolocation options
        setOptions: function(overides) {
          options = _.defaults(overides, options);
        },

        // run callbacks once based on success/failure of retrieving geolocation
        locate: function(callback, errorCallback) {
          this._checkExists();

          navigator.geolocation.getCurrentPosition(this._onSuccess(callback), this._onError(errorCallback), options);

          return this;
        },

        // register handlers to run each time device position is updated; this can be cleared with stopWatch
        watch: function(callback, errorCallback) {
          this._checkExists();

          this._watchId = navigator.geolocation.watchPosition(this._onSuccess(callback), this._onError(errorCallback), options);

          return this;
        },

        // remove the watcher
        stopWatch: function() {
          if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this._watchId);
          }
          return this;
        },


        /* ------------------------- INTERNAL methods --------------------- */

        _checkExists: function() {
          if (!navigator.geolocation) {
            this._onError({
              code: 0,
              message: 'Geolocation not supported.'
            });
          }
          return this;
        },

        _onError: function(callback) {
          return function(error) {
            var c = error.code,
              message = error.message ||
                (c === 1 ? 'permission denied' :
                  (c === 2 ? 'position unavailable' : 'timeout'));

            var ret = {
              code: c,
              message: 'Geolocation error: ' + message + '.'
            };

            console.log('Geo Error', ret);

            // if they passed an error handler use it
            if (typeof callback !== 'undefined') {
              callback.call(null, ret);
            }
          };
        },

        _onSuccess: function(callback) {
          return function(pos) {
            var lat = pos.coords.latitude,
              lng = pos.coords.longitude,
              latlng = {
                latitude: lat,
                longitude: lng
              },
              latAccuracy = 180 * pos.coords.accuracy / latDivisor,
              lngAccuracy = latAccuracy / Math.cos(lonDivisor * lat),
              bounds = {
                northwest: [lat - latAccuracy, lng - lngAccuracy],
                southeast: [lat + latAccuracy, lng + lngAccuracy]
              };

            var data = {
              latlng: latlng,
              bounds: bounds
            };

            for (var i in pos.coords) {
              if (typeof pos.coords[i] === 'number') {
                data[i] = pos.coords[i];
              }
            }

            callback.call(null, data);
            return this;
          }
        }
      };
    }

  });


}());
