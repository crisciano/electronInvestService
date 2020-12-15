
const { logger } = require('../utils/logger')
const { genericError } = require('../utils/Message')
const FiisService = require('../services/FiisService')
const { getFiisFull } = require('../services/OtherInfosService')

class ProductsController {
  /**
     *
     * @param {object} query
     */
  async getFiis () {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        // let fiis
        let fiis = await FiisService.getFiis()

        let otherInfos = await getFiisFull()

        // filter objct empty
        fiis = fiis.filter(v => Object.keys(v).length !== 0);

        fiis = fiis.map( fii => {
          let other = otherInfos.filter(v => v.ticker === fii.id)[0]

          if(other){
            fii.liquidez = other.liquidezmediadiaria ? other.liquidezmediadiaria : 0
            fii.numeros_cotistas = other.numerocotistas ? other.numerocotistas : 0
            fii.cagr = other.cota_cagr ? other.cota_cagr : 0
          }
          // cagr = crescimento anual composto medio

          return fii
        })
        
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
