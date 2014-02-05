var keys = {
  google: 'AIzaSyANbYCPy8261jwpRcDMR6RDrawr5v2vcpY'
};

module.exports = exports = {
  mongo: /*! MONGO */'mongodb://localhost:27017/skipspicks',
  google: {
    apiKey: keys.google,
    places: {
      textSearchEndpoint: 'https://maps.googleapis.com/maps/api/place/textsearch/json?sensor=true&key=' + keys.google,
      nearbySearchEndpoint: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?sensor=true&key=' + keys.google,
      radius: 8000 // meters; about 5 miles
    }
  }
};
