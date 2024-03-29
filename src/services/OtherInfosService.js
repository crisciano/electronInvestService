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
          url: process.env.OTHER_URL + "/category/advancedsearchresultpaginated",
          params: {
            search: search
              ? search
              : '{"Sector":"","SubSector":"","Segment":"","my_range":"-20;100","forecast":{"upsidedownside":{"Item1":null,"Item2":null},"estimatesnumber":{"Item1":null,"Item2":null},"revisedup":true,"reviseddown":true,"consensus":[]},"dy":{"Item1":null,"Item2":null},"p_l":{"Item1":null,"Item2":null},"peg_ratio":{"Item1":null,"Item2":null},"p_vp":{"Item1":null,"Item2":null},"p_ativo":{"Item1":null,"Item2":null},"margembruta":{"Item1":null,"Item2":null},"margemebit":{"Item1":null,"Item2":null},"margemliquida":{"Item1":null,"Item2":null},"p_ebit":{"Item1":null,"Item2":null},"ev_ebit":{"Item1":null,"Item2":null},"dividaliquidaebit":{"Item1":null,"Item2":null},"dividaliquidapatrimonioliquido":{"Item1":null,"Item2":null},"p_sr":{"Item1":null,"Item2":null},"p_capitalgiro":{"Item1":null,"Item2":null},"p_ativocirculante":{"Item1":null,"Item2":null},"roe":{"Item1":null,"Item2":null},"roic":{"Item1":null,"Item2":null},"roa":{"Item1":null,"Item2":null},"liquidezcorrente":{"Item1":null,"Item2":null},"pl_ativo":{"Item1":null,"Item2":null},"passivo_ativo":{"Item1":null,"Item2":null},"giroativos":{"Item1":null,"Item2":null},"receitas_cagr5":{"Item1":null,"Item2":null},"lucros_cagr5":{"Item1":null,"Item2":null},"liquidezmediadiaria":{"Item1":null,"Item2":null},"vpa":{"Item1":null,"Item2":null},"lpa":{"Item1":null,"Item2":null},"valormercado":{"Item1":null,"Item2":null}}',
            CategoryType: 2,
            take: 470
          },
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
