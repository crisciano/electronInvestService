const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const { logger } = require('../utils/logger')

router.post('/', async (req, res) => {
    try {
        const example = await AuthController.auth(req.body)
        res.status(200).json(example)
    } catch (err) {
        console.log(err);
        const statusCode = err.response.status
        logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status(statusCode).json({ success: false, message: 'Manual Review Failed', err })
    }
})

module.exports = router