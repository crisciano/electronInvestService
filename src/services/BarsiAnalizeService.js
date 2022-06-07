const puppeteer = require('puppeteer');

const axios = require("axios")
const { logger } = require("../utils/logger")
const { genericError } = require("../utils/Message")

class BarsiAnalizeService {

    analize(url) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    method: 'get',
                    url
                }
                axios(options)
                    .then(res => resolve(res.data))
                    .catch(err => {
                        logger.error(genericError('analize - axios', err))
                        reject(err)
                    })
            } catch (err) {
                logger.error(genericError('analize', err))
                reject(err)
            }
        })
    }
}

module.exports = new BarsiAnalizeService()