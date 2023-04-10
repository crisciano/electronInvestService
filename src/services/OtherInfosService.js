const axios = require("axios");
const { logger } = require("../utils/logger");
const { genericError } = require("../utils/Message");

class OtherInfosService {
  getFiisFull = (search) => {
    return new Promise((resolve, reject) => {
      try {
        // CategoryType 2 = fiis 1 = ações
        const options = {
          method: "get",
          url: process.env.OTHER_URL + "/category/advancedsearchresult",
          params: {
            search:
              '{"Segment":"","Gestao":"","my_range":"0;20","dy":{"Item1":null,"Item2":null},"p_vp":{"Item1":null,"Item2":null},"percentualcaixa":{"Item1":null,"Item2":null},"numerocotistas":{"Item1":null,"Item2":null},"dividend_cagr":{"Item1":null,"Item2":null},"cota_cagr":{"Item1":null,"Item2":null},"liquidezmediadiaria":{"Item1":null,"Item2":null},"patrimonio":{"Item1":null,"Item2":null}}',
            CategoryType: 2,
          },
          headers: {
            "User-Agent": "null",
          },
        };

        axios(options)
          .then((res) => resolve(res.data))
          .catch((err) => {
            console.log(err);
            logger.error(genericError("getFiisFull - axios", err));
            reject(err);
          });
      } catch (error) {
        logger.error(genericError("getFiisFull", err));
        reject(err);
      }
    });
  };
}

module.exports = new OtherInfosService();
