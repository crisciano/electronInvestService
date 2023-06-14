const { logger } = require("../utils/logger");
const { genericError } = require("../utils/Message");
const FiisService = require("../services/FiisService");
const { getFiisFull } = require("../services/OtherInfosService");

class ProductsController {
  /**
   *
   * @param {object} query
   */
  async getFiis() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        let fiis = await FiisService.getFiisNew()
        // let fiis
        // let fiis = await FiisService.getFiis();


        let otherInfos = await getFiisFull();
        // filter objct empty
        fiis = fiis.filter((v) => Object.keys(v).length !== 0);

        fiis = fiis.map((fii) => {
          let other = otherInfos.filter((v) => v.ticker === fii.ticker)[0];

          if (other) {
            fii.liquidezmediadiaria = other.liquidezmediadiaria
              ? other.liquidezmediadiaria
              : 0;
            fii.numero_cotistas = other.numerocotistas
              ? other.numerocotistas
              : 0;
            fii.cagr = other.cota_cagr ? other.cota_cagr : 0;
          } else {
            fii.numero_cotistas = 0;
            fii.cagr = 0;
          }

          fii.valor = fii.valor === "-9999999999" ? 0 : fii.valor;
          fii.liquidezmediadiaria = fii.liquidezmediadiaria === "-9999999999" ? 0 : fii.liquidezmediadiaria;
          fii.p_vpa =
            fii.p_vpa === "9999999999" || fii.p_vpa === "Infinity"
              ? 0
              : fii.p_vpa;
          fii.pvp = fii.pvp === "-9999999999" ? 0 : fii.pvp;
          fii.media_yield_12m = fii.media_yield_12m === "-9999999999" ? 0 : fii.media_yield_12m;

          fii.vacancia_fisica =
            fii.vacancia_fisica === "-9999999999" ||
            fii.vacancia_fisica === "0.0"
              ? 0
              : Number(fii.vacancia_fisica);
          fii.vacancia_financeira =
            fii.vacancia_financeira === "-9999999999" ||
            fii.vacancia_financeira === "0.0"
              ? 0
              : Number(fii.vacancia_financeira);
          // cagr = crescimento anual composto medio

          return fii;
        });

        resolve(fiis || []);
      } catch (err) {
        console.log("getFiis controller", err);
        logger.error(genericError("getFiis controller", err));
        return reject(err);
      }
    });
  }
}

module.exports = new ProductsController();
