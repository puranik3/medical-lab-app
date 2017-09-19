var express = require( 'express' );
var router = express.Router();

var medicalTestsCtrl = require( '../controllers/medical-tests' );

router.get( '/', medicalTestsCtrl.find );
router.get( '/:medicalTestId', medicalTestsCtrl.findById );
router.post( '/', medicalTestsCtrl.create );
router.put( '/:medicalTestId', medicalTestsCtrl.updateById );
router.delete( '/:medicalTestId', medicalTestsCtrl.deleteById );

module.exports = router;