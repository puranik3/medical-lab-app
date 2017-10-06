var express = require( 'express' );
var router = express.Router();

var patientsCtrl = require( '../controllers/patients' );

router.get( '/', patientsCtrl.find );
router.get( '/:patientId', patientsCtrl.findById );
router.post( '/', patientsCtrl.create );
router.put( '/:patientId', patientsCtrl.updateById );
router.delete( '/:patientId', patientsCtrl.deleteById );

router.get( '/:patientId/orders', patientsCtrl.orders.find );
router.post( '/:patientId/orders', patientsCtrl.orders.create );

module.exports = router;