const puppeteer = require('puppeteer');
const { logger } = require('../utils/logger');

class FiisServices {

    getFiis = () => {
        return new Promise(async (resolve, reject)  => {
            logger.info('Create Promise service getFiis...')
            const browser = await puppeteer.launch({
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
            });
            const page = await browser.newPage()
            await page.goto(process.env.URL)

            process.on('unhandledRejection', (reason, p) => {
                logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
                browser.close();
            });
            
            
            const result = await page.evaluate(() => {
        
                const data = []
                const ids = [
                    'id',
                    'setor',
                    'preco',
                    'liquidez',
                    'dividendo',
                    'DY',
                    'DY_acum_3m',
                    'DY_acum_6m',
                    'DY_acum_12m',
                    'DY_medio_3m',
                    'DY_medio_6m',
                    'DY_medio_12m',
                    'DY_ano',
                    'variacao_preco',
                    'rentabilidade_periodo',
                    'rentabilidade_acumulada',
                    'patrimonio_liq',
                    'VPA',
                    'P_VPA',
                    'DY_patrimonial',
                    'variacao_patrimonial',
                    'rentabilidade_patrimonial_periodo',
                    'rentabilidade_patrimonial_acumulada',
                    'vacancia_fisica',
                    'vacancia_financeira',
                    'quantidade_ativos',
                ]
        
                // section
                const div = document.getElementById('ranking');
                // lista todos os trs
                div.querySelectorAll('tr')
                    .forEach(f => {
                        const item = {}
                        // lista todos os tds
                        f.querySelectorAll('td')
                            .forEach( (v, key)=> {
                                const obj = {}
                                // se houver valor do data-index usa ele
                                // senao pega do data-order que e a index do fii
                                // caso não tenha nenhum dos dois usa o innerText
                                if(v.getAttribute('data-index')) {
                                    value = v.getAttribute('data-index')
                                }else if( v.getAttribute('data-order') ){
                                    value = v.getAttribute('data-order')
                                }else { value = v.innerText }
                                
                                // monta o obj com key dinamica
                                obj[ids[key]] = value
        
                                // inclui novo item no obj
                                Object.assign(item, obj)
                            })
        
                        data.push( item ) 
                    })
                return data
            })
        
            browser.close()
            resolve(result)
        })
    }
}



module.exports = new FiisServices()