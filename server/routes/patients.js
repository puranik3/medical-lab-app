var express = require( 'express' );
var router = express.Router();

var patientsCtrl = require( '../controllers/patients' );

/* GET patients listing. */
router.get( '/', patientsCtrl );

module.exports = router;