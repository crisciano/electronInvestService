const { logger } = require('../utils/logger')
const { genericError } = require('../utils/Message')
const MagicFormulaService = require('../services/MagicFormulaService')
const FiisService = require("../services/FiisService");
const filters = require('../utils/filters')
const Helpers = require('../helpers/Helpers')
const { KEYS } = require('../config/config')

class MagicFormulaController {

    fiis (ids, headers) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                // let fiis
                // let fiis = await MagicFormulaService.getFiis()
                let fiis = await FiisService.getFiisNew()
        
                // filter objct empty
                fiis = fiis.filter(v => Object.keys(v).length !== 0);
        
                // filtro por keys
                fiis = Helpers.filterByKeys( fiis, KEYS.fiis )
        
                // remove fundos sem preço e sem liquidezmediadiaria "N/A" "-9999999999"
                const filterKeys = Object.keys(filters);
                fiis = fiis.filter(fii => filterKeys.every(key => (!filters[key].length)? true : filters[key](fii[key])));
                
                // remove fundos de baixa liquidezmediadiaria
                fiis = fiis.filter(fii => fii.liquidezmediadiaria > 200000.00)
        
                // order por dy medio dos ultimos 12 meses de maior para menor
                fiis =  Helpers.sortByKeyDesc(fiis, 'media_yield_12m' )
                
                // ranking_dym
                fiis = fiis.map((fii, key)=> {
                    fii.ranking_dym = key + 1 
                    return fii
                })
                
                // order por p-pva medio dos ultimos 12 meses de menor para o maior
                fiis =  Helpers.sortByKeyCres(fiis, 'p_vpa' )
        
                // ranking_pvpa
                fiis = fiis.map((fii, key)=> {
                    fii.ranking_pvpa = key + 1 
                    return fii
                })
        
                // magic formula
                fiis = fiis.map((fii, key)=> {
                    fii.magic_formula = fii.ranking_dym + fii.ranking_pvpa
                    return fii
                })
        
                // ordermagic_formula de menor para maior
                fiis =  Helpers.sortByKeyCres(fiis, 'magic_formula' )
                
                // normalização dos dados
                fiis = Helpers.normalize('fii', fiis)

                // calcular media e mediana menor que 15%
                // mediana a soma de todos os dividendo do ultimo ano dividido por 12

        
                
                resolve(fiis || [])
            } catch (err) {
            console.log('getProduts controller', err)
            logger.error(genericError('getProducts controller', err))
            return reject(err)
            }
        })
    }

    acoes (ids, headers) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                let acoes = await MagicFormulaService.getAcoes()

                // roic/ev_ebit

                // filtro por keys
                // const keys = ["companyName", "ticker", "p_L", "ev_ebit", "roe", "roic", "liquidezmediadiariamediadiaria"] 
                acoes = Helpers.filterByKeys( acoes, KEYS.acoes )
                
                // remove acoes de baixa liquidezmediadiaria
                acoes  = acoes.filter(acao => acao.liquidezmediadiaria > 150000 )
                
                // remove acoes com p/l negativo
                acoes  = acoes.filter(acao => acao.p_l > 0 )
                
                // remove acoes com ev_ebit negativo
                acoes  = acoes.filter(acao => acao.ev_ebit > 0 )
                
                // lista de bancos
                const bancos = acoes.filter(acao => acao.roic ===  undefined)

                // remove roic igual a undefined
                acoes = acoes.filter(acao => acao.roic !==  undefined)
                
                // ordernar roic de menor para maior
                acoes = Helpers.sortByKeyDesc(acoes, "roic")

                // ranking_roic
                acoes = acoes.map((acao, key)=> {
                    acao.ranking_roic = key + 1 
                    return acao
                })

                // incluir bancos no fim da lista pois possuim roic igual a undefined 
                // bancos.map(banco => acoes.push({ ...banco, ranking_roic : acoes.length + 1 }))
                bancos.map(banco => acoes.push(banco))

                // ordernar roic de menor para maior
                acoes = Helpers.sortByKeyCres(acoes, "ev_ebit")

                // ranking_evebit
                acoes = acoes.map((acao, key)=> {
                    acao.ranking_evebit = key + 1 
                    return acao
                })

                // magic formula
                acoes = acoes.map(acao => {
                    acao.magic_formula = acao.ranking_roic
                                                ? (acao.ranking_roic + acao.ranking_evebit)
                                                : acao.ranking_evebit
                    return acao
                })

                // ordernar roic de maior para menor
                acoes = Helpers.sortByKeyCres(acoes, "magic_formula")


                resolve(acoes || [])
            } catch (err) {
                console.log(err);
                const msg = {response: {status: '500', error: err }}
                 logger.error(genericError('acoes', err))
                 reject(err )
            }
        })
    }

    acoesCustom (ids, headers) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                let acoes = await MagicFormulaService.getAcoes()

                // roe/p_L

                // filtro por keys
                const keys = ["companyname", "ticker", "p_l", "ev_ebit", "roe", "roic", "liquidezmediadiariamediadiaria"] 
                acoes = Helpers.filterByKeys( acoes, keys )

                // remove acoes de baixa liquidezmediadiaria
                acoes  = acoes.filter(acao => acao.liquidezmediadiariamediadiaria > 150000 )

                // remove acoes com p/l negativo
                acoes  = acoes.filter(acao => acao.p_l > 0 )

                // remove acoes com ev_ebit negativo
                acoes  = acoes.filter(acao => acao.ev_ebit > 0 )

                // ordernar roe crescente menor para maior
                acoes = Helpers.sortByKeyCres(acoes, "roe")

                // ranking_roe
                acoes = acoes.map((acao, key)=> {
                    acao.ranking_roe = key + 1 
                    return acao
                })

                // ordernar pl decrescente maior para menor
                acoes = Helpers.sortByKeyDesc(acoes, "p_l")

                // ranking_pl 
                acoes = acoes.map((acao, key)=> {
                    acao.ranking_pl = key + 1 
                    return acao
                })

                // magic formula
                acoes = acoes.map(acao => {
                    acao.magic_formula = acao.ranking_roe + acao.ranking_pl
                    return acao
                })

                // // ordernar roic de maior para menor
                acoes = Helpers.sortByKeyCres(acoes, "magic_formula")


                resolve(acoes || [])
            } catch (err) {
                console.log(err);
                const msg = {response: {status: '500', error: err }}
                 logger.error(genericError('acoes', err))
                 reject(err )
            }
        })
    }
}

module.exports = new MagicFormulaController()