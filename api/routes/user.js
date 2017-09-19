var express = require( 'express' );
var router = express.Router();

var userCtrl = require( '../controllers/users' );

router.get( '/', userCtrl.find );
router.get( '/:patientId', userCtrl.findById );
router.post( '/', userCtrl.create );
router.put( '/:patientId', userCtrl.updateById );
router.delete( '/:patientId', userCtrl.deleteById );

module.exports = router;