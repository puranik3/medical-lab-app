var express = require( 'express' );
var router = express.Router();

var ordersCtrl = require( '../controllers/orders' );

/* GET orders listing */
router.get( '/', ordersCtrl );

module.exports = router;