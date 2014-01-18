var mysql = require('mysql'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  Q = require('q'),
  conn = mongoose.connect('mongodb://localhost/skipspicks');

function checkError(err) {
  if (err) {
    return console.log('Error', err);
  }
}

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'skipspicks'
});


var asc = 1,
  desc = -1;

// build out a detail config
var ConfigSchema = new mongoose.Schema({
  details: [],
  cuisines: [],
  ratings: [],
  types: [],
  prices: []
});

var Config = mongoose.model('Config', ConfigSchema);

// clear out previous ones
Config.remove({}, function(err) {
  checkError(err);
  console.log('cleared Config');
});

var config = new Config(getDefaults());
save(config);

/**
 * only if the defaults above are outdated
 *
var sql = connection.query('select * from detail', function(err, details) {
  checkError(err);
  details.forEach(function(det) {
    console.log('working on config');
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
  save(config);
});
*/

function save(config) {
  config.save(function(err) {
    checkError(err);
    console.log(config, 'DONE');
  });
}

function getDefaults() {
  return {
      "cuisines": [
          "American", 
          "Bakery", 
          "Bbq", 
          "Bistro", 
          "Byob", 
          "Cajun", 
          "Chinese", 
          "Coffee", 
          "Comfort", 
          "Creole", 
          "Cuban", 
          "Czech", 
          "Deli", 
          "Dessert", 
          "Dim sum", 
          "Espresso/wine/beer", 
          "French", 
          "German", 
          "Greek", 
          "Indian", 
          "Italian", 
          "Japanese", 
          "Korean", 
          "Lebanese", 
          "Mediterranean", 
          "Mexican", 
          "Noodle", 
          "Northwest", 
          "Nouveau", 
          "Pan asian", 
          "Pizza", 
          "Seafood", 
          "Seasonal/local", 
          "Shut down", 
          "South american", 
          "Southern", 
          "Steak", 
          "Surf/turf", 
          "Sushi", 
          "Swedish", 
          "Tapas/small plate", 
          "Thai", 
          "Vegetarian", 
          "Vietnamese", 
          "Asian"
      ], 
      "details": [
          "Breakfast", 
          "Patio/Outdoor", 
          "Late Food", 
          "Counter", 
          "Lunch", 
          "Full Bar", 
          "Trivia Night", 
          "Loud", 
          "Shuffleboard", 
          "New", 
          "Wish List", 
          "Solo Okay", 
          "Good Happy Hour", 
          "Buffet", 
          "Street/Cart Food", 
          "GoTo", 
          "Cocktails"
      ], 
      "prices": [
          "$", 
          "$$", 
          "$$$", 
          "$$$$"
      ], 
      "ratings": [
          "0", 
          "1", 
          "2", 
          "3", 
          "4", 
          "5"
      ], 
      "types": [
          "Places", 
          "Skate Shop", 
          "Spa", 
          "Bar", 
          "Restaurant", 
          "Brew 'n' View", 
          "Bowling Alley", 
          "Hotel"
      ]
  };
}

