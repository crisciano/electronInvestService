const puppeteer = require("puppeteer");
const axios = require("axios");
const { genericError } = require("../utils/Message");
const { logger } = require("../utils/logger");

class FiisServices {
  getFiis = () => {
    return new Promise(async (resolve, reject) => {
      logger.info("Create Promise service getFiis...");
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(process.env.URL + '/ranking');

      process.on("unhandledRejection", (reason, p) => {
        logger.error("Unhandled Rejection at: Promise", p, "reason:", reason);
        browser.close();
      });

      const result = await page.evaluate(() => {
        const data = [];
        const ids = [
          "id",
          "setor",
          "preco",
          "liquidez",
          "dividendo",
          "DY",
          "DY_acum_3m",
          "DY_acum_6m",
          "DY_acum_12m",
          "DY_medio_3m",
          "DY_medio_6m",
          "DY_medio_12m",
          "DY_ano",
          "variacao_preco",
          "rentabilidade_periodo",
          "rentabilidade_acumulada",
          "patrimonio_liq",
          "VPA",
          "P_VPA",
          "DY_patrimonial",
          "variacao_patrimonial",
          "rentabilidade_patrimonial_periodo",
          "rentabilidade_patrimonial_acumulada",
          "vacancia_fisica",
          "vacancia_financeira",
          "quantidade_ativos",
        ];

        // section
        const div = document.querySelector('.default-fiis-table__container__table__body')
        // lista todos os trs
        div.querySelectorAll("tr").forEach((f) => {
          const item = {};
          // lista todos os tds
          f.querySelectorAll("td").forEach((v, key) => {
            const obj = {};
            // se houver valor do data-value usa ele
            // senao pega do data-order que e a index do fii
            // caso não tenha nenhum dos dois usa o innerText
            if (v.getAttribute("data-value")) {
              value = v.getAttribute("data-value");
            } else if (v.getAttribute("data-order")) {
              value = v.getAttribute("data-order");
            } else {
              value = v.innerText;
            }

            // monta o obj com key dinamica
            obj[ids[key]] = value;

            // inclui novo item no obj
            Object.assign(item, obj);
          });

          data.push(item);
        });
        return data;
      });

      browser.close();
      resolve(result);
    });
  };

  getFiisNew = () => {
    return new Promise(async (resolve, reject) => {
      logger.info("Create Promise service getFiisNew...");
      try {
        const options = {
          method: 'get',
          url: process.env.URL + '/wp-json/funds/v1/get-ranking',
          headers: { 
            'X-Funds-Nonce': '61495f60b533cc40ad822e054998a3190ea9bca0d94791a1da'
          }
        };

        axios(options)
          .then((res) => resolve(JSON.parse(res.data)))
          .catch((err) => {
            console.log(err);
            logger.error(genericError("getFiisNew - axios", err));
            reject(err);
          });
      } catch (err) {
        logger.error(genericError("getFiisNew", err));
        reject(err);
      }

    });
  }
}

module.exports = new FiisServices();
