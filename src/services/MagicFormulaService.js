const env = require("../utils/EnvironmentVariables");
const axios = require("axios");

const { genericError } = require("../utils/Message");

const puppeteer = require("puppeteer");
const { logger } = require("../utils/logger");

class MagicFormulaService {
  getFiis = () => {
    return new Promise(async (resolve, reject) => {
      logger.info("Create Promise service getFiis...");
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(process.env.URL);

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
        const div = document.getElementById("ranking");
        // lista todos os trs
        div.querySelectorAll("tr").forEach((f) => {
          const item = {};
          // lista todos os tds
          f.querySelectorAll("td").forEach((v, key) => {
            const obj = {};
            // se houver valor do data-index usa ele
            // senao pega do data-order que e a index do fii
            // caso não tenha nenhum dos dois usa o innerText
            if (v.getAttribute("data-index")) {
              value = v.getAttribute("data-index");
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

  getAcoes = (search) => {
    return new Promise((resolve, reject) => {
      try {
        // CategoryType 2 = fiis 1 = ações
        const options = {
          method: "get",
          url: process.env.OTHER_URL + "/category/advancedsearchresult",
          params: {
            search: search
              ? search
              : '{"Sector":"","SubSector":"","Segment":"","my_range":"0;25","dy":{"Item1":null,"Item2":null},"p_L":{"Item1":null,"Item2":null},"peg_Ratio":{"Item1":null,"Item2":null},"p_VP":{"Item1":null,"Item2":null},"p_Ativo":{"Item1":null,"Item2":null},"margemBruta":{"Item1":null,"Item2":null},"margemEbit":{"Item1":null,"Item2":null},"margemLiquida":{"Item1":null,"Item2":null},"p_Ebit":{"Item1":null,"Item2":null},"eV_Ebit":{"Item1":null,"Item2":null},"dividaLiquidaEbit":{"Item1":null,"Item2":null},"dividaliquidaPatrimonioLiquido":{"Item1":null,"Item2":null},"p_SR":{"Item1":null,"Item2":null},"p_CapitalGiro":{"Item1":null,"Item2":null},"p_AtivoCirculante":{"Item1":null,"Item2":null},"roe":{"Item1":null,"Item2":null},"roic":{"Item1":null,"Item2":null},"roa":{"Item1":null,"Item2":null},"liquidezCorrente":{"Item1":null,"Item2":null},"pl_Ativo":{"Item1":null,"Item2":null},"passivo_Ativo":{"Item1":null,"Item2":null},"giroAtivos":{"Item1":null,"Item2":null},"receitas_Cagr5":{"Item1":null,"Item2":null},"lucros_Cagr5":{"Item1":null,"Item2":null},"liquidezMediaDiaria":{"Item1":null,"Item2":null},"vpa":{"Item1":null,"Item2":null},"lpa":{"Item1":null,"Item2":null},"valorMercado":{"Item1":null,"Item2":null}}',
            CategoryType: 1,
          },
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
          },
        };

        axios(options)
          .then((res) => resolve(res.data))
          .catch((err) => {
            logger.error(genericError("getFiisFull - axios", err));
            reject(err);
          });
      } catch (error) {
        logger.error(genericError("getFiisFull", error));
        reject(error);
      }
    });
  };
}

module.exports = new MagicFormulaService();
