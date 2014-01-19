var model = require('./lib/model'),
  Location = model.Location,
  urlRoot = '/api/v1',
  locationPath = urlRoot + '/location';

exports = module.exports = function(app) {

  // Location
  app.get(locationPath + '/:id?', function(req, res, next) {
    // req.query or req.body
    if (req.params.id) {
      req.query._id = req.params.id;
    }

    Location.read(req.query, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  });

  app.post(locationPath, function(req, res, next) {
    console.log(req.body);
    Location.update(req.body, function(err, result) {
      if (err) {
        return next(err);
      }
      res.json(201, {_id: result._id});
    });
  });

  app.put(locationPath, function(req, res, next) {
    Location.create(req.body, function(err, result) {
      if (err) {
        next(err);
      }
      res.json(201, {_id: result._id});
    });
  });

  app.delete(locationPath + '/:id', function(req, res, next) {
    Location.delete(req.params.id, function(err, result) {
      if (err) {
        next(err);
      }
      res.json({_id: req.params.id});
    });
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

