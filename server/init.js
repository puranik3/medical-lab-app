var mongoose = require( 'mongoose' );
var async = require( 'async' );

var medicalTests = 

mongoose.connect('mongodb://localhost/medilab');

var collections = ['medical-test', 'package', 'patient', 'patient-test'];

// drop all collections
async.each(collections, function(c, done){
    db.collection(c).drop(done);
});

// 
var users = db.collection(users);
var total = 0;
async.whilst(function(){ return total < 100; }, 
function(done) {
 users.insert({name: getNameString(), ...}, done);
}, function(){
 //all done
});