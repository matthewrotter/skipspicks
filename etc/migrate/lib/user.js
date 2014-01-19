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

User.remove({}, function(err) {
  checkError(err);
  console.log('cleared User');
});

// users
connection.query('select * from user', function(err, rows) {
  checkError(err);
  rows.forEach(function(row) {
    var user = new User({
      id: row.user_id,
      username: row.user_name,
      password: row.password,
      email: row.email,
      mobile: null,
      created: Date.now()
    });
    user.save(function(err) {
      checkError(err);
    });
  });
  console.log('DONE');
});

