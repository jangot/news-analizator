const commandLineArgs = require('command-line-args');
const moment = require('moment');
const axios = require('axios');

const { runScript } = require('../services/run-script');
const config = require('../configuration');

const { start = moment(), end = moment() } = commandLineArgs([
    { name: 'start', alias: 's', type: moment },
    { name: 'end', alias: 'e', type: moment },
]);
const from = start.format('YYYY-MM-DD');
const to = end.format('YYYY-MM-DD');

const client = axios.create({ baseURL: config.apiNews.url });
client.interceptors.request.use((config) => {
    console.log('--------------------')
    console.log(config)
    return config;
});

runScript(async () => {
    // https://newsapi.org/v2/everything?q=tesla&from=2024-09-08&sortBy=publishedAt&apiKey=8775a8a062f54453b7f85a546b02c07d
    try {
        const params = {
            q: 'russia',
            from,
            to,
            sortBy: 'popularity',
            pageSize: 10,
            // country: 'ru',
            apiKey: config.apiNews.key,
        };
        const { data } = await client.get('/v2/everything', { params });

        console.log('10 самых популярных новостей на русском:');
        console.log(JSON.stringify(data, null, 4));
        // data.articles.forEach(article => {
        //     console.log(`- ${article.title} (${article.source.name})`);
        // });
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}, 'load top news');
