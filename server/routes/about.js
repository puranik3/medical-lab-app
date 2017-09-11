var express = require('express');
var router = express.Router();

var aboutCtrl =  require( '../controllers/about' );

/* GET about page. */
router.get('/', aboutCtrl);

module.exports = router;
