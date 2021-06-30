const express = require('express')
const router = express.Router()
const MagicFormulaController = require('../controllers/MagicFormulaController')
const { logger } = require('../utils/logger')
const { loadLogs } = require('../routes/logsRouter')

router.get('/fiis', async (req, res) => {
    try {
        const example = await MagicFormulaController.fiis(req.query, req.headers)
        res.status(200).json(example)
    } catch (err) {
        const statusCode = err.response.status
        logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status(statusCode).json({ success: false, message: 'Manual Review Failed', err })
    }
})

router.get('/acoes', async (req, res) => {
    try {
        const example = await MagicFormulaController.acoes(req.query, req.headers)
        res.status(200).json(example)
    } catch (err) {
        console.log(err);
        const statusCode = err.response.status
        logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status(statusCode).json({ success: false, message: 'Manual Review Failed', err })
    }
})

router.get('/acoes/custom', async (req, res) => {
    try {
        const example = await MagicFormulaController.acoesCustom(req.query, req.headers)
        res.status(200).json(example)
    } catch (err) {
        console.log(err);
        const statusCode = err.response.status
        logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status(statusCode).json({ success: false, message: 'Manual Review Failed', err })
    }
})

router.get('/test', (req, res) => {
    res.status(200).send('Products route test! OK!')
})

router.get('/logs', loadLogs)

module.exports = router