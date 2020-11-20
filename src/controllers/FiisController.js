
const { logger } = require('../utils/logger')
const { genericError } = require('../utils/Message')
const FiisService = require('../services/FiisService')

class ProductsController {
  /**
     *
     * @param {object} query
     */
  async getFiis () {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
          const fiis = await FiisService.getFiis()
        resolve(fiis || [])
      } catch (err) {
        console.log('getProduts controller', err)
        logger.error(genericError('getProducts controller', err))
        return reject(err)
      }
    })
  }

}

module.exports = new ProductsController()
