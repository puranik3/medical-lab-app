var express = require( 'express' );
var router = express.Router();

var ordersCtrl = require( '../controllers/orders' );

router.get( '/', ordersCtrl.find );
router.get( '/:orderId', ordersCtrl.findById );
router.post( '/', ordersCtrl.create );
router.put( '/:orderId', ordersCtrl.updateById );
router.delete( '/:orderId', ordersCtrl.deleteById );

router.get( '/:orderId/medicaltestsandpackages', ordersCtrl.medicalTestsAndPackages.find );
router.put( '/:orderId/medicaltestsandpackages', ordersCtrl.medicalTestsAndPackages.add );

// This endpoint requires a query parameter type = medicaltest | package
// Example: /1234/medicaltests/6789?type=medicaltest
router.delete( '/:orderId/medicaltestsandpackages/:id', ordersCtrl.medicalTestsAndPackages.delete );

router.get( '/:orderId/report', ordersCtrl.reports.find );
router.put( '/:orderId/report', ordersCtrl.reports.update );

module.exports = router;