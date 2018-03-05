var express = require('express');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var router = express.Router();
var User = require('../models/user');

/* Register. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* Login. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/register', function(req, res,next) {
		var first_name = req.body.first_name;
		var email = req.body.email;
		var last_name = req.body.last_name;
		var password = req.body.password;
		var password2 = req.body.password2;

		//validation
		req.checkBody('first_name','First Name is required').notEmpty();
		req.checkBody('last_name','Last Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Password do not match').equals(req.body.password);

		var errors = req.validationErrors();

		if(errors)
		{
			res.render('register', 
			{
				errors : errors
			});
		}
		else
		{
			var newUser = new User
			({
				first_name: first_name,
				last_name: last_name,
				email:email,
				password:password
			});

			User.createUser(newUser, function(err,user)
			{
				 if(err) throw err;
				 console.log(user); 
			});

			req.flash('success_msg', 'Your are registered and can login now');
			res.redirect('/users/login');
		}
});
passport.use(new LocalStrategy(
	function (first_name, last_name ,email,password,done) {
		// body...
		User.getUserByUsername(email,function(err,user)
			{
				if(err) throw err;
				if (!user)
				{
					return done(null, false,{message: 'Unknown User'});
				} 
				User.comparePassword(password,user.password,function(err,isMatch)
				{
					if (err) throw err; 
					if(isMatch)
					{
						return done(null,user);
					}
					else
					{
						return done(null,false,{message: 'Invalid Password'});
					}
				});
			});
	}));

passport.serializeUser(function (user,done) {
	// body...
	done(null, user.id);
})
passport.deserializeUser(function(id,done)
{
	User.getUserById(id,function(err,user)
	{
		done(err,user);
	});
});

router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash:true}),
function(req,res)
{
	res.redirect('/');
});

router.get('/logout', function(req,res)
{
	req.logout();
	req.flash('success_msg', 'You are Logged Out');
	res.redirect('/users/login');
})

module.exports = router;
