var express = require( 'express' );
var router = express.Router();

var testsCtrl = require( '../controllers/tests' );

/* GET tests listing */
router.get( '/', testsCtrl );

module.exports = router;