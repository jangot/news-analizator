const commandLineArgs = require('command-line-args');

const {  News } = require('../models');
const { runScript } = require('../services/run-script');
const { getKeywords } = require('../services/open-api');


const { limit = 5, offset = 0 } = commandLineArgs([
    { name: 'limit', alias: 'l', type: Number },
    { name: 'offset', alias: 'o', type: Number },
]);

runScript(async () => {
    const requestParams = {
        where: { keywords: null },
        order: [['date', 'DESC']],
        offset,
        limit,
    }

    let news = await News.findAll(requestParams);
    while (news.length > 0) {
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

        news = await News.findAll(requestParams);
    }
}, 'Keywords');
