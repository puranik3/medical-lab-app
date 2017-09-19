var express = require( 'express' );
var router = express.Router();

var packagesCtrl = require( '../controllers/packages' );

/* GET packages listing */
router.get( '/', packagesCtrl );

module.exports = router;