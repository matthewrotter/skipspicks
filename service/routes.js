var _ = require('underscore'),
  request = require('request'),
  qs = require('qs'),
  model = require('./lib/model'),
  Location = model.Location,
  Config = model.Config,
  urlRoot = '/api/v1',
  locationPath = urlRoot + '/location',
  configPath = urlRoot + '/config';

exports = module.exports = function(app) {

  /*
   * Locaton
   */

  // search by geo
  app.get(locationPath + '/geo/:swLatitude/:swLongitude/:neLatitude/:neLongitude', function(req, res, next) {
    var query = {
      'lat': {$gte: req.params.swLatitude, $lte: req.params.neLatitude},
      'lng': {$gte: req.params.swLongitude, $lte: req.params.neLongitude}
    };

    Location.extension.read(query, {limit: 50}, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  });

  // filter by attribute lists
  app.post(locationPath + '/filter', function(req, res, next) {
    var filters = req.body;

    console.log('FILTER', filters);
    var query = {};
    if (!_.isEmpty(filters.tags)) {
      _.extend(query, {
        $or: [
          {cuisine: {$in: filters.tags}},
          {details: {$in: filters.tags}},
          {type: {$in: filters.tags}},
          {name: {$in: filters.tags}}
        ]
      });
    }

    if (filters.bounds) {
      _.extend(query, {
        'lat': {$gte: filters.bounds[0], $lte: filters.bounds[2]},
        'lng': {$gte: filters.bounds[1], $lte: filters.bounds[3]}
      });
    }

    console.log('ASD', JSON.stringify(query));


    Location.extension.read(query, {limit: 50 /*, projection: {cuisine: 1} */}, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  });

  // import location data
  app.get(locationPath + '/import', function(req, res, next) {
    var locs = require('./lib/import/location');

    locs.forEach(function(loc) {
      delete loc._id;

      massageSpecialTypes(loc);

      Location.extension.create(loc, function(err) {
        if (err) {
          console.log('E?', err);
        }
      });
    });
    res.json({ok: true});
  });

  app.post(locationPath + '/:id/review', function(req, res, next) {
    Location.extension.addReview(req.params.id, req.body, function(err) {
      res.json({err: err});
    });
  });


  // CRUD
  app.get(locationPath + '/:id?', function(req, res, next) {
    // BEER: move to header?
    var options = {
      limit: 50
    };
    if (req.query.limit) {
      options.limit = req.query.limit;
      delete req.query.limit;
    }

    // req.query or req.body
    if (req.params.id) {
      req.query._id = req.params.id;
    }

    Location.extension.read(req.query, options, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  });

  app.post(locationPath, function(req, res, next) {
    console.log('POST', req.body);
    Location.extension.update(req.body, function(err, result) {
      if (err) {
        return next(err);
      }
      res.json(201, {_id: result._id});
    });
  });

  app.put(locationPath, function(req, res, next) {
    console.log('PUT', req.body);
    Location.extension.create(req.body, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(201, {_id: result._id});
    });
  });

  app.delete(locationPath + '/:id', function(req, res, next) {
    Location.extension.delete(req.params.id, function(err, result) {
      if (err) {
        next(err);
      }
      res.json({_id: req.params.id});
    });
  });


  /*
   * Config
   */
  app.get(configPath, function(req, res, next) {
    Config.read({}, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  });


  /*
   * Google Places pass-thru
   */
  app.get(urlRoot + '/places/:latlng/:query?', function(req, res, next) {
    // key and sensor are set in config
    var url = app.config.google.places.nearbySearchEndpoint,
      options = {
        location: req.params.latlng,
        types: 'bar|restaurant|food|liquor_store|casino|convenience_store|bowling_alley|cafe|grocery_or_supermarket|laundry|lodging|meal_delivery|meal_takeaway|movie_theater|night_club|park|police|spa|stadium',
        // keyword: req.params.query, // nearby
      };

    if (req.params.query) {
      options.query = req.params.query;
      options.radius = app.config.google.places.radius;
      url = app.config.google.places.textSearchEndpoint;
    } else {
      options.rankby = 'distance'; // for nearby, not text search
    }

    url += '&' + qs.stringify(options);
    console.log('GoogUrl', url);
    request.get(url).pipe(res);
  });


  // import
  app.get(configPath + '/import', function(req, res, next) {
    var config = require('./lib/import/config');

    Config.create(config, function(err) {
      if (err) {
        console.log('E?', err);
      }
    });
    res.json({ok: true});
  });


  // route not found
  app.all('*', function(req, res) {
    res.status(404);
    if (req.xhr) {
      res.send({ error: 'Resource not found.' });
    }
    res.send('404 Not Found Dude!');
  });

};


// helpers
// massage special types eg $date; this should be functioniszed
function massageSpecialTypes(obj) {
  obj.created = obj.created && obj.created.$date;
  obj.updated = obj.updated && obj.updated.$date;
  obj.reviews.forEach(function(rev) {
    rev.updated = rev.updated && rev.updated.$date;
  });
}
