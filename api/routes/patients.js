var express = require( 'express' );
var router = express.Router();

var patientsCtrl = require( '../controllers/patients' );

router.get( '/count', patientsCtrl.count );
router.get( '/', patientsCtrl.find );
router.get( '/:patientId', patientsCtrl.findById );
router.post( '/', patientsCtrl.create );
router.put( '/:patientId', patientsCtrl.updateById );
router.delete( '/:patientId', patientsCtrl.deleteById );

router.get( '/:patientId/orders', patientsCtrl.orders.find );
router.get( '/:patientId/orders/:orderId', patientsCtrl.orders.findById );
router.post( '/:patientId/orders', patientsCtrl.orders.create );
router.put( '/:patientId/orders/:orderId', patientsCtrl.orders.updateById );
router.delete( '/:patientId/orders/:orderId', patientsCtrl.orders.deleteById );

router.get( '/:patientId/orders/:orderId/medicaltestsandpackages', patientsCtrl.orders.medicalTestsAndPackages.find );
router.put( '/:patientId/orders/:orderId/medicaltestsandpackages', patientsCtrl.orders.medicalTestsAndPackages.add );

// This endpoint requires a query parameter type = medicaltest | package
// Example: 123/orders/456/medicaltests/789?type=medicaltest
router.delete( '/:patientId/orders/:orderId/medicaltestsandpackages/:id', patientsCtrl.orders.medicalTestsAndPackages.delete );

router.get( '/:patientId/orders/:orderId/report', patientsCtrl.orders.report.find );

// This endpoint requires a query parameter action = initiate | draft | complete
// Example: 123/orders/456/report?action=draft
router.put( '/:patientId/orders/:orderId/report', patientsCtrl.orders.report.update );

module.exports = router;