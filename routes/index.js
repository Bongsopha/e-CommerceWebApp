var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

function ensureAuthenticated(req,res,next) {
	// body...
	if (req.isAuthenticated()) {
		return next();
	}
	else
	{
		res.redirect('/users/login');
	}
}

module.exports = router;
