const router = require('express').Router()
const PoolerController = require('../controllers/PoolerController')
const SkidTagController = require('../controllers/SkidTagController')
const EpcTagController = require('../controllers/EpcTagController')

router.post('/pool', PoolerController.processData)
router.get('/skid-info', SkidTagController.querySkid)
router.get('/epc-info', EpcTagController.queryEpc)

module.exports = router