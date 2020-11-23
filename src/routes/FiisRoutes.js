const express = require('express')
const router = express.Router()
const FiisController = require('../controllers/FiisController')

const { logger } = require('../utils/logger')
const { loadLogs } = require('../routes/logsRouter')

router.get('/', async (req, res) => {
  try {
    const products = await FiisController.getFiis()
    logger.info('Request Get in getFiis...'+ new Date())
    res.status(200).json(products)
  } catch (err) {
    logger.error('Error of MS &&' + JSON.stringify(err))
    res.status(500).json({ success: false, message: 'Manual Review Failed', err })
  }
})

router.get('/test', (req, res) => {
  res.status(200).send('Fiis route test! OK!')
})

router.get('/logs', loadLogs)

module.exports = router
