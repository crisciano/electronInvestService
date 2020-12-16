
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
            fii.numero_cotistas = other.numerocotistas ? other.numerocotistas : 0
            fii.cagr = other.cota_cagr ? other.cota_cagr : 0
          }else{
            fii.numero_cotistas = 0
            fii.cagr = 0
          }
          
          fii.preco = fii.preco === '-9999999999' ? 0 : fii.preco 
          fii.liquidez = fii.liquidez === '-9999999999' ? 0 : fii.liquidez 
          fii.P_VPA = fii.P_VPA === '9999999999' || fii.P_VPA === 'Infinity' ? 0 : fii.P_VPA 
          fii.VPA = fii.VPA === '-9999999999' ? 0 : fii.VPA 
          fii.DY_ano = fii.DY_ano === '-9999999999' ? 0 : fii.DY_ano 

          fii.vacancia_fisica = fii.vacancia_fisica === '-9999999999' || fii.vacancia_fisica === '0.0' 
                                          ? 0 
                                          : Number(fii.vacancia_fisica)
          fii.vacancia_financeira = fii.vacancia_financeira === '-9999999999' || fii.vacancia_financeira === '0.0' 
                                          ? 0 
                                          : Number(fii.vacancia_financeira)
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
