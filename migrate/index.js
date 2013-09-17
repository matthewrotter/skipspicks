var mysql = require('mysql'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  Q = require('q'),
  conn = mongoose.connect('mongodb://localhost/skipspicks');

var asc = 1,
  desc = -1;

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

LocationSchema.index({
  created: desc
});
LocationSchema.index({
  updated: desc
});

var Location = mongoose.model('Location', LocationSchema);
// mongoose.Types.ObjectId

var UserSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  email: String,
  mobile: Number,
  updated: { type: Date, default: Date.now },
  created: Date
});

var User = mongoose.model('User', UserSchema);

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'skipspicks'
});

// users
/*
 connection.query('select * from user', function(err, rows) {
 rows.forEach(function(row) {
 var user = new User({
 id: row.user_id,
 username: row.user_name,
 password: row.password,
 email: row.email,
 mobile: null,
 created: Date.now()
 });
 user.save();
 });
 console.log('DONE');
 });
 */

// build out a detail config
var ConfigSchema = new mongoose.Schema({
  details: [],
  cuisines: [],
  ratings: [],
  types: [],
  prices: []
});

var Config = mongoose.model('Config', ConfigSchema);
var config = new Config({
  details: [],
  cuisines: [],
  ratings: [],
  types: [],
  prices: []
});

var sql = connection.query('select * from detail', function(err, details) {
  details.forEach(function(det) {
    switch (det.detail_type_id) {
      case 1:
        config.details.push(det.description);
        break;
      case 2:
        config.cuisines.push(det.description);
        break;
      case 3:
        config.ratings.push(det.description);
        break;
      case 4:
        config.types.push(det.description);
        break;
      case 5:
        config.prices.push(det.description);
        break;
    }
  });
  console.log('C', config);
  config.save();
});


// locations
connection.query('select * from location', function(err, rows) {
  // console.log(err, rows);
  console.log('L', rows.length);

  rows.forEach(function(row) {
    var location = new Location({
      id: row.location_id,
      type: [],
      details: [],
      ratings: [],
      cuisine: [],
      price: null,
      name: row.name,
      address: row.address,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      hours: row.hours,
      phone: row.phone.replace(/\D/g, ""),
      reviews: [],
      pick: row.pick !== 0,
      lat: row.lat, // replace with native type?
      lng: row.lng,
      userId: row.user_id,
      url: row.url,
      updated: row.update_time,
      created: row.create_time
    });

    Q.all([
        (function() {
          var deferred = Q.defer();
          var sql = connection.query('select r.* , d.description as rating from review r inner join location_review_map lrm on lrm.review_id = r.review_id left outer join detail d on d.detail_id = r.rating_detail_id where lrm.location_id = ?', [row.location_id], function(err, reviews) {
            reviews.forEach(function(rev) {
              location.reviews.push({
                id: rev.review_id,
                body: rev.body.toString().replace(/\\/g, ""),
                updated: rev.update_time,
                userId: rev.user_id,
                rating: rev.rating
              })
            });

            deferred.resolve();
          });
          return deferred.promise;
        }()),
        (function() {
          var deferred = Q.defer();
          var sql = connection.query('select d.description, d.detail_type_id, dt.description as detail_type from detail d inner join location_detail_map ldm on ldm.location_id = ?  and ldm.detail_id = d.detail_id inner join detail_type dt on dt.detail_type_id = d.detail_type_id', [row.location_id], function(err, details) {
            details.forEach(function(det) {
              switch (det.detail_type) {
                case 'detail':
                  location.details.push(det.description);
                  break;
                case 'cuisine':
                  location.cuisine.push(det.description);
                  break;
                case 'rating':
                  location.ratings.push(det.description);
                  break;
                case 'location_type':
                  location.type.push(det.description);
                  break;
                case 'price':
                  location.price = det.description;
                  break;
                default:
                  console.log('WHOA: ' + det.detail_type);
              }
            });
            deferred.resolve();
          });
          return deferred.promise;
        }())
      ])
      .then(function(result) {
        // console.log('finally', location);
        location.save(function(err) {
          if (err) {
            console.log('ERROR', err);
          }
        });
      });

    // now shoveinski any related images into gridfs
    /*
     var sql = connection.query('select path from location_image where location_id = ?', [row.location_id], function(err, images) {
     images.forEach(function(img) {
     console.log()
     });
     });
     */

    // console.log(sql.sql);
  });
  console.log('DONE');

  connection.end();
});
