var express = require( 'express' );
var router = express.Router();

var packagesCtrl = require( '../controllers/packages' );

router.get( '/count', packagesCtrl.count );
router.get( '/', packagesCtrl.find );
router.get( '/:packageId', packagesCtrl.findById );
router.post( '/', packagesCtrl.create );
router.put( '/:packageId', packagesCtrl.updateById );
router.delete( '/:packageId', packagesCtrl.deleteById );

router.get( '/:packageId/medicaltests', packagesCtrl.findMedicalTests );
router.put( '/:packageId/medicaltests', packagesCtrl.addMedicalTests );
router.delete( '/:packageId/medicaltests/:medicalTestId', packagesCtrl.deleteMedicalTestById );

module.exports = router;