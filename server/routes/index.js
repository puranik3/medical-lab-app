var express = require('express');
var router = express.Router();

var indexCtrl =  require( '../controllers/index' );

/* GET home page */
router.get('/', indexCtrl);

module.exports = router;
