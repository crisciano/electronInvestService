const express = require('express')
const router = express.Router()
const AnalizeController = require('../controllers/AnalizeController')
const { logger } = require('../utils/logger')
const { loadLogs } = require('../routes/logsRouter')

router.get('/', async (req, res) => {
    try {
        const example = await AnalizeController.analize(req.query)
        res.status(200).json(example)
        // res.status(200).json(req.query)
    } catch (err) {
        console.log(err);
        // const statusCode = err.response.status
        // logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status('500').json({ success: false, message: 'Manual Review Failed', err })
    }
})

router.post('/', async (req, res) => {
    try {
        const example = await AnalizeController.analize(req.body)
        res.status(200).json(example)
        // res.status(200).json(req.query)
    } catch (err) {
        console.log(err);
        // const statusCode = err.response.status
        // logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status('500').json({ success: false, message: 'Manual Review Failed', err })
    }
})

router.get('/test', (req, res) => {
    res.status(200).send('Products route test! OK!')
})

router.get('/logs', loadLogs)

module.exports = router