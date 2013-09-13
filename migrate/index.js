var mysql = require('mysql'),
  mongoose = require('mongoose'),
  conn = mongoose.connect('mongodb://localhost/skipspicks');

var asc = 1,
  desc = -1;

var LocationSchema = new mongoose.Schema({
  id: Number,
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

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'skipspicks'
});

// connection.connect();

connection.query('select * from location limit 2', function(err, rows) {
  // console.log(err, rows);

  rows.forEach(function(row) {
    var sql = connection.query('select r.* , d.description as rating from review r inner join location_review_map lrm on lrm.review_id = r.review_id left outer join detail d on d.detail_id = r.rating_detail_id where lrm.location_id = ?', [row.location_id], function(err, rows) {
      console.log(rows);
    });
    console.log(sql.sql);
  });


  connection.end();
});
