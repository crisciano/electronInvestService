const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

const auth = require('../middleware/Auth')

router.post("/", async (req, res) => {
    try {
        const example = await UserController.user(req.body)
        res.status(200).json(example)
    } catch (err) {
        console.log(err);
        const statusCode = err.response.status
        logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status(statusCode).json({ success: false, message: 'Manual Review Failed', err })
    }
});

router.get('/teste', auth, async (req, res) => {
    try {
        // const example = await ExampleController.example(req.query, req.headers)
        res.status(200).json({success: true})
    } catch (err) {
        const statusCode = err.response.status
        logger.error('Received Error of webhook &&' + JSON.stringify(err))
        res.status(statusCode).json({ success: false, message: 'Manual Review Failed', err })
    }
})

module.exports = router;