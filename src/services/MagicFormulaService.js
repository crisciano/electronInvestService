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
          url: process.env.OTHER_URL + "/category/advancedsearchresultpaginated",
          params: {
            search: search
              ? search
              : '{"Sector":"","SubSector":"","Segment":"","my_range":"-20;100","forecast":{"upsidedownside":{"Item1":null,"Item2":null},"estimatesnumber":{"Item1":null,"Item2":null},"revisedup":true,"reviseddown":true,"consensus":[]},"dy":{"Item1":null,"Item2":null},"p_l":{"Item1":null,"Item2":null},"peg_ratio":{"Item1":null,"Item2":null},"p_vp":{"Item1":null,"Item2":null},"p_ativo":{"Item1":null,"Item2":null},"margembruta":{"Item1":null,"Item2":null},"margemebit":{"Item1":null,"Item2":null},"margemliquida":{"Item1":null,"Item2":null},"p_ebit":{"Item1":null,"Item2":null},"ev_ebit":{"Item1":null,"Item2":null},"dividaliquidaebit":{"Item1":null,"Item2":null},"dividaliquidapatrimonioliquido":{"Item1":null,"Item2":null},"p_sr":{"Item1":null,"Item2":null},"p_capitalgiro":{"Item1":null,"Item2":null},"p_ativocirculante":{"Item1":null,"Item2":null},"roe":{"Item1":null,"Item2":null},"roic":{"Item1":null,"Item2":null},"roa":{"Item1":null,"Item2":null},"liquidezcorrente":{"Item1":null,"Item2":null},"pl_ativo":{"Item1":null,"Item2":null},"passivo_ativo":{"Item1":null,"Item2":null},"giroativos":{"Item1":null,"Item2":null},"receitas_cagr5":{"Item1":null,"Item2":null},"lucros_cagr5":{"Item1":null,"Item2":null},"liquidezmediadiaria":{"Item1":null,"Item2":null},"vpa":{"Item1":null,"Item2":null},"lpa":{"Item1":null,"Item2":null},"valormercado":{"Item1":null,"Item2":null}}',
            CategoryType: 1,
            take: 620
          },
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
          },
        };

        axios(options)
          .then((res) => resolve(res.data.list))
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
