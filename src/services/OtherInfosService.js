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
          maxBodyLength: Infinity,
          url:
            process.env.OTHER_URL +
            "/category/advancedsearchresult?search=%7B%22Segment%22%3A%22%22%2C%22Gestao%22%3A%22%22%2C%22my_range%22%3A%220%3B20%22%2C%22dy%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22p_vp%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22percentualcaixa%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22numerocotistas%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22dividend_cagr%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22cota_cagr%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22liquidezmediadiaria%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22patrimonio%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22valorpatrimonialcota%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22numerocotas%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%2C%22lastdividend%22%3A%7B%22Item1%22%3Anull%2C%22Item2%22%3Anull%7D%7D&CategoryType=2",
          // params: {
          //   search:
          //     '{"Segment":"","Gestao":"","my_range":"0;20","dy":{"Item1":null,"Item2":null},"p_vp":{"Item1":null,"Item2":null},"percentualcaixa":{"Item1":null,"Item2":null},"numerocotistas":{"Item1":null,"Item2":null},"dividend_cagr":{"Item1":null,"Item2":null},"cota_cagr":{"Item1":null,"Item2":null},"liquidezmediadiaria":{"Item1":null,"Item2":null},"patrimonio":{"Item1":null,"Item2":null}}',
          //   CategoryType: 2,
          // },
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
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
