const puppeteer = require('puppeteer');

class BarsiAnalizeService {

    analize(id, type = 1) {
        return new Promise(async (resolve, reject) => {
            const options = {
                dumpio: false,
                ignoreHTTPSErrors: true,
                headless: false,
                timeout: 100000
            }

            const browser = await puppeteer.launch(options);
            // const browser = await puppeteer.launch();
            const page = await browser.newPage()

            await page.setViewport({ width: 1440, height: 746 });
            // type 1 - acoes 2 - fiis
            const base = process.env.OTHER_URL
            const url = type === "1"
                ? base + '/acoes/' + id + '3'
                : base + '/fundos-imobiliarios/' + id

            await page.goto(url)

            await page.waitForTimeout(1500);

            const value = await page.evaluate(() => {
                return document.getElementsByClassName('value')[0].innerHTML
            });

            const data = await page.evaluate(() => {
                return document.getElementById('results').value
            });

            // console.log( data );

            const result = {
                data: JSON.parse(data),
                value
            }

            browser.close()
            resolve(result)
        })
    }

    newAnalize(url) {
        return new Promise(async (resolve, reject) => {
            // const options = {
            //     dumpio: false,
            //     ignoreHTTPSErrors: true,
            //     headless: false,
            //     timeout: 100000
            // }

            const options = {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--single-process'
                ],
            }

            const browser = await puppeteer.launch(options);
            // const browser = await puppeteer.launch();

            try {
                const page = await browser.newPage()

                // await page.setViewport({width: 1440, height: 746});

                await page.goto(url, { waitUntil: 'networkidle2' })
                // await page.goto(url, {waitUntil: 'domcontentloaded'})
                // await page.goto(url)

                process.on('unhandledRejection', (reason, p) => {
                    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
                    browser.close();
                });

                await page.waitForTimeout(1500);

                const error = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('span'))
                        .find(span => span.innerText === "OPS. . .") ? true : false
                });

                // await page.waitForTimeout(2500);

                if (!error) {

                    const info = await extractInfo(page)
                    const { value, data } = info

                    // console.log('result extractInfo', info);

                    const result = {
                        data: JSON.parse(data),
                        value
                    }

                    browser.close()
                    resolve(result)
                } else {
                    browser.close()
                    resolve({ error: true })
                }

            } catch (error) {
                browser.close()
                reject(error)
            }

        })
    }
}

const extractInfo = (page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await page.evaluate(() => {
                // const info = document.querySelectorAll('.top-info')[0]
                // const value = info.querySelectorAll('.value')[0].innerText
                const value = document.querySelectorAll('.value')[0].innerText
                const data = document.getElementById('results').value

                return { value, data }
            });

            resolve(result)

        } catch (error) {
            console.error('BarsiAnalizeService - extractInfo(): ' + error);
            reject(error);
        }
    })
}

module.exports = new BarsiAnalizeService()