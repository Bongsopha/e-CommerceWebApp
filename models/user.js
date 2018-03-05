var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// mongoose.connect('mongodb://localhost/E-Project');
// var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema(
{
	first_name:
	{
		type:String
	},
	last_name:
	{
		type: String
	},
	password:
	{
		type: String
	},
	email:
	{
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
	// body...
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB. 
        newUser.password = hash;
        newUser.save(callback);
    });
});
}

module.exports.getUserByUsername = function(email, callback)
{
	var query = {email:email};
	User.findOne(query,callback);
}
module.exports.getUserById = function(id, callback)
{
	User.findById(query,callback);
}

module.exports.comparePassowrd = function(candidatePassword, hash, callback)
{
	bcrypt.compare(candidatePassword, hash, function(err,isMatch)
	{
		if (err) throw err;
		callback(null, isMatch);
	});
}
