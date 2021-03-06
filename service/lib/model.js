var mongoose = require('mongoose'),
  _ = require('underscore'),
  config = require('../config'),
  conn;

var asc = 1,
  desc = -1;


/*
 * TODO:
 * - add disabled flag
 * - move lat/lng to geolocation native
 */
var LocationSchema = new mongoose.Schema({
  id: Number,
  type: [],
  details: [],
  ratings: [],
  cuisine: [],
  price: String,
  name: String,
  address: String,
  city: String,
  state: String,
  postalCode: String,
  hours: String,
  phone: Number,
  reviews: [],
  pick: Boolean,
  lat: Number, // replace with native type?
  lng: Number,
  userId: Number,
  url: String,
  updated: { type: Date, default: Date.now },
  created: Date
});

var Location = mongoose.model('Location', LocationSchema);
// mongoose.Types.ObjectId
// mongoose.Schema.Types.ObjectId;


/*-------- implement CRUD -------*/

// read; filter is a mongoose/mongo query pattern
Location.read = function(filter, options, callback) {
  console.log('F', filter, options);
  var query = Location.find(filter);

  if (options.limit) {
    query.limit(options.limit);
  }

  // .sort({updated: asc})
  query.exec(function(err, result) {
    callback(err, result);
  });
};


// create
Location.create = function(location, callback) {
  var newlocation = new Location({
    id: location.id,
    type: location.type,
    details: location.details,
    ratings: location.ratings,
    cuisine: location.cuisine,
    price: location.price,
    name: location.name,
    address: location.address,
    city: location.city,
    state: location.state,
    postalCode: location.postalCode,
    hours: location.hours,
    phone: location.phone,
    reviews: location.reviews,
    pick: location.pick,
    lat: location.lat,
    lng: location.lng,
    userId: location.userId,
    url: location.url,
    updated: Date.now(),
    created: Date.now()
  });
  newlocation.save(function(err) {
    callback(err, newlocation);
  });
};

// update
Location.update = function(location, callback) {
  // find existing by uuid
  Location.findById(location._id, function(err, existing) {
    if (err || !existing) {
      callback('No match found');
      return;
    }

    var updated = _.extend(existing, {
      id: location.id,
      type: location.type,
      details: location.details,
      ratings: location.ratings,
      cuisine: location.cuisine,
      price: location.price,
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      hours: location.hours,
      phone: location.phone,
      reviews: location.reviews,
      pick: location.pick,
      lat: location.lat,
      lng: location.lng,
      userId: location.userId,
      url: location.url,
      updated: Date.now(),
      created: location.created
    });

    updated.save(function(err) {
      callback(err, updated);
    });
  });
};

Location.delete = function(_id, callback) {
  Location.findByIdAndRemove(_id, function(err) {
    callback(err, _id);
  });
};


// Config
var ConfigSchema = new mongoose.Schema({
  details: [],
  cuisines: [],
  ratings: [],
  types: [],
  prices: []
});

var Config = mongoose.model('Config', ConfigSchema);

Config.read = function(filter, callback) {
  callback(null, ['we', 'week', 'weekend']);
  return;

/*
  Config.find(filter, function(err, result) {
    callback(err, result[0]);
  });
*/
};


// exports
exports.Location = Location;
exports.Config = Config;

var uri = config.mongo;
if (!conn) {
  conn = mongoose.connect(uri);
}
console.log('connected to mongo');
