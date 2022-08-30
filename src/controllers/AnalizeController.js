const BarsiAnalizeService = require('../services/BarsiAnalizeService');
const { logger } = require('../utils/logger')
const { genericError } = require('../utils/Message')
const Helpers = require('../helpers/Helpers')

class AnalizeController {

    /**
     * default
     * roof (percentual roof) = 6
     * type (stock or fiis) = 1
     * time (time analize) = 5
     */
    analize(body) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const base = process.env.ANALIZE_URL

                const { items, roof = 6 } = body

                let result = []

                for (const key in items) {
                    if (Object.hasOwnProperty.call(items, key)) {
                        const item = items[key];
                        const { id, type = 1, time = 5, logs = false } = item;

                        if (type === 2) {
                            result.push(await fiisController(id, time, base, roof))
                        } else {
                            const res = await stocksController(id, time, base, roof)
                            result.push(...res)
                            // result.push(res)
                        }
                    }
                }

                const resultSort = Helpers.sortByKeyDesc(result, "return")

                console.log(resultSort);

                resolve(resultSort || [])
            } catch (err) {
                logger.error(genericError('analize', err))
                reject(err)
            }
        })
    }
}

fiisController = (id, time, base, roof) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cod = id + "11"
            // https://mfinance.com.br/api/v1/fiis
            const urlDy = base + '/fiis/dividends/' + cod
            const urlData = base + '/fiis/' + cod
            const urlHistoricals = process.env.HISTORY_URL + cod

            // resolve(BarsiAnalizeService.newAnalize(urlDy))
            const { dividends, symbol } = await BarsiAnalizeService.analize(urlDy);
            const { lastPrice: price } = await BarsiAnalizeService.analize(urlData);
            const { data: historicals = [] } = await BarsiAnalizeService.generic(urlHistoricals + '/year/5')

            const analize = sanitize(dividends, price, time, symbol, roof, historicals)

            resolve(analize || {})
        } catch (error) {
            logger.error('AnalizeController - (): ' + error);
            reject(error);
        }
    })
}

stocksController = (id, time, base, roof) => {
    return new Promise(async (resolve, reject) => {
        try {
            const actionTypes = [3, 4, 6, 11]
            // const actionTypes = [3]

            const result = []

            const urlDy = base + '/stocks/dividends/' + id
            const urlData = base + '/stocks/' + id
            const urlHistoricals = process.env.HISTORY_URL + id

            for (const id in actionTypes) {
                if (Object.hasOwnProperty.call(actionTypes, id)) {
                    const type = actionTypes[id];

                    const dy = BarsiAnalizeService.analize(urlDy + type)
                    const data = BarsiAnalizeService.analize(urlData + type)
                    const historical = BarsiAnalizeService.generic(urlHistoricals + type + '/year/5')

                    const promises = await Promise.all([dy, data, historical])
                    const { dividends, symbol } = promises[0]
                    const { lastPrice: price } = promises[1]
                    const { data: historicals = [] } = promises[2]
                    
                    if (dividends) {
                        const dy = dividends.map(item => ({ ...item, payDate: item.date }))

                        const analize = sanitize(dy, price, time, symbol, roof, historicals)

                        result.push(analize)
                    }
                }
            }

            resolve(result || [])

        } catch (error) {
            logger.error('AnalizeController - (): ' + error);
            reject(error);
        }
    })

}


sanitize = (dividends, price, time, symbol, roof, historicals) => {

    const currentYear = new Date().getFullYear()

    let dy = dividends.filter(({ payDate }) => payDate !== null)
    // sanitize year
    dy = dy.map(({ payDate, value }) => ({ year: payDate.split('-')[0], value }))
    // groupBy year
    dy = Helpers.groupBy(dy, 'year')
    // reduce values by year
    dy = sanitizeValuesDy(dy)
    // remove the last year
    dy = dy.filter(({ year }) => year !== currentYear)
    // filter the last years
    dy = dy.slice(Math.max(dy.length - time, 1))

    const valueDy = dy.reduce((acum, { value }) => acum + value, 0)
    // media dos dy
    const mediaYear = Number(valueDy.toFixed(2)) / time

    return {
        id: symbol,
        dividends: dy,
        return: Number(((mediaYear * 100) / price).toFixed(2)),
        roof: Number(((mediaYear * 100) / roof).toFixed(2)),
        mediaPrice: Number(mediaYear.toFixed(2)),
        price,
        historicals
    }
}

function sanitizeValuesDy(result) {
    return Object.keys(result)
        .map(year => {
            const dy = result[year]
                // .map(value => Number(value.replace(',', '.')))
                .reduce((acum, { value }) => acum + value, 0)
                .toFixed(2)
            return {
                year: Number(year),
                value: Number(dy)
            }
        })
}

module.exports = new AnalizeController()