const { Helpers } = require('../helpers/Helpers');
const BarsiAnalizeService = require('../services/BarsiAnalizeService');
const { logger } = require('../utils/logger')
const { genericError } = require('../utils/Message')

class AnalizeController {

    analize(query) {
        const { id, type, time = 5, logs = false } = query;
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const base = process.env.OTHER_URL

                if (type === "2") {
                    const url = base + '/fundos-imobiliarios/' + id

                    const { value, data } = await BarsiAnalizeService.analize(id, type);

                    const currentValue = Number(value.replace(',', '.'))

                    let result = data
                    // primeiro tratamento retorna ano e dy
                    result = sanitizeData(data)
                    // agrupa todos os data
                    result = sanitizeValuesDy(result)
                    // remove o current year
                    result = removeYear(result)
                    // busca os ultimos resultados baseado no time passado
                    result = result.slice(Math.max(result.length - time, 1))
                    // value do dy
                    const valueDy = result.reduce((acum, { dy }) => acum + dy, 0)
                    // media dos dy
                    const mediaYear = Number(valueDy.toFixed(2)) / time

                    const teto = Number((mediaYear * 100) / 6)

                    const analize = {
                        teto,
                        isChecked: teto < currentValue ? true : false,
                        currentValue,
                        values: result
                    }


                    resolve(analize || {})
                } else {
                    const actionTypes = [3, 4, 11]
                    // const actionTypes = [ 3 ]

                    const result = []

                    const url = base + '/acoes/' + id

                    const cod = id

                    for (const id in actionTypes) {
                        if (Object.hasOwnProperty.call(actionTypes, id)) {
                            const type = actionTypes[id];
                            // console.log(url + type);
                            const { value, data, error } = await BarsiAnalizeService.newAnalize(url + type);

                            if (!error) {

                                result.push({ [cod + type]: sanitize(value, data, time) })

                            }

                        }
                    }

                    resolve(result || [])
                }
            } catch (err) {
                logger.error(genericError('analize', err))
                reject(err)
            }
        })
    }
}


function sanitize(value, data, time) {
    const price = Number(value.replace(',', '.'))

    let result = data
    // primeiro tratamento retorna ano e dy
    result = sanitizeData(data)
    // agrupa todos os data
    result = sanitizeValuesDy(result)
    // remove o current year
    result = removeYear(result)
    // busca os ultimos resultados baseado no time passado
    result = result.slice(Math.max(result.length - time, 1))
    // value do dy
    const valueDy = result.reduce((acum, { dy }) => acum + dy, 0)
    // media dos dy
    const mediaYear = Number(valueDy.toFixed(2)) / time

    // console.log(mediaYear);

    return {
        "6%": Number((mediaYear * 100) / 6) > price ? true : false,
        "7%": Number((mediaYear * 100) / 7) > price ? true : false,
        "8%": Number((mediaYear * 100) / 8) > price ? true : false,
        "10%": Number((mediaYear * 100) / 10) > price ? true : false,
        "12%": Number((mediaYear * 100) / 12) > price ? true : false,
        price,
        // values: result
    }
}

function sanitizeData(result) {
    return result
        .map(item => ({
            value: item.sv,
            year: item.pd.split('/')[2]
        }))
        .reduce((results, item) => {
            (results[item.year] = results[item.year] || []).push(item.value);
            return results
        }, {})
}

function sanitizeValuesDy(result) {
    return Object.keys(result)
        .map(year => {
            const dy = result[year]
                .map(value => Number(value.replace(',', '.')))
                .reduce((acum, item) => acum + item, 0)
                .toFixed(2)
            return {
                year: Number(year),
                dy: Number(dy)
            }
        })
}

function removeYear(result) {
    const currentYear = new Date().getFullYear()
    return result.filter(({ year }) => year !== currentYear)

}


module.exports = new AnalizeController()