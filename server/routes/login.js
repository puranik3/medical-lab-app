var express = require('express');
var router = express.Router();

var loginCtrl =  require( '../controllers/login' );

/* GET login page */
router.get('/', loginCtrl);

module.exports = router;
