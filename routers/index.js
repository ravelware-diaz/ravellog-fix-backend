const router = require('express').Router()
const PoolerController = require('../controllers/PoolerController')


router.post('/pool', PoolerController.proceedData)

module.exports = router