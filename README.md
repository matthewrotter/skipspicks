skipspicks
==========

Skip's Picks v.3


ToDo:

- menu slide from right to left
  - move map and center when menu slides out
- add search
- add filters
- add user favoriting (localStorage)
- add user creation interface
- hanlde 300ms delay!-
- move context menu based on orientation 
- optimize location grabbing 
- empty tray on close? or at Lear scroll up
- CACHE Config from mongo, on server and/or in client
- Add indexes

jitsu databases create mongo skipspicks
info:    Welcome to Nodejitsu matthewrotter
info:    jitsu v0.13.9, node v0.10.24
info:    It worked if it ends with Nodejitsu ok
info:    Executing command databases create mongo skipspicks
info:    A new mongo has been created
data:    Database Type: mongo
data:    Database Name: skipspicks
data:    Connection url: mongodb://nodejitsu_matthewrotter:khs1qlmg6qd9n4sbod6a373huj@ds061558.mongolab.com:61558/nodejitsu_matthewrotter_nodejitsudb8673834323
help:    
help:    Connect with the `mongo` cli client:
help:    
             $ mongo ds061558.mongolab.com:61558/nodejitsu_matthewrotter_nodejitsudb8673834323 -u nodejitsu_matthewrotter -p khs1qlmg6qd9n4sbod6a373huj
help:    
help:    Connect with the `mongodb-native module`:
help:    
             var mongodb = require('mongodb');
             var db = new mongodb.Db('nodejitsu_matthewrotter_nodejitsudb8673834323',
               new mongodb.Server('ds061558.mongolab.com', 61558, {})
             );
             db.open(function (err, db_p) {
               if (err) { throw err; }
               db.authenticate('nodejitsu_matthewrotter', 'khs1qlmg6qd9n4sbod6a373huj', function (err, replies) {
                 // You are now connected and authenticated.
               });
             });
help:    
help:    Connect with the `mongoose` module:
help:    
             var mongoose = require('mongoose');
             mongoose.connect('mongodb://nodejitsu_matthewrotter:khs1qlmg6qd9n4sbod6a373huj@ds061558.mongolab.com:61558/nodejitsu_matthewrotter_nodejitsudb8673834323');
help:    
info:    Nodejitsu ok

