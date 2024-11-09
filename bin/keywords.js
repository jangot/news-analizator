const commandLineArgs = require('command-line-args');

const {  News } = require('../models');
const { runScript } = require('../services/run-script');
const { getKeywords } = require('../services/open-api');
const { wait } = require('../services/utils');

const { limit = 5, offset = 0, reverse = 1 } = commandLineArgs([
    { name: 'limit', alias: 'l', type: Number },
    { name: 'offset', alias: 'o', type: Number },
    { name: 'reverse', alias: 'r', type: Number },
]);



runScript(async () => {
    const requestParams = {
        where: { keywords: null },
        order: [['date', reverse > 0 ? 'DESC' : 'ASC']],
        offset,
        limit,
    }

    let news = await News.findAll(requestParams);
    while (true) {
        try {
            console.log('-------------------------------------------');
            console.time('Generation');
            const keywords = await getKeywords(news);
            console.timeEnd('Generation');
            for (const one of news) {
                if (keywords[one.id]) {
                    one.keywords = keywords[one.id].join(',');

                    console.log('')
                    console.log(one.id, one.title, one.date);
                    console.log(one.keywords)
                    await one.save();
                }
            }
        } catch (error) {
            console.error(error);
        }

        news = await News.findAll(requestParams);
        if (news.length === 0) {
            await wait(60000);
        }
    }
}, 'Keywords');
