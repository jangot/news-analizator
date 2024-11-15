const axios = require('axios');
const moment = require('moment');
const commandLineArgs = require('command-line-args');

const config = require('../configuration');
const { loadDayPortion, loadPosts } = require('../services/post-loader');
const { runScript } = require('../services/run-script');
const { setLeadingZeros, wait } = require('../services/utils');

const yesterdayMorning = moment().add(-1, 'days');
const {
    year = yesterdayMorning.format('YYYY'),
    month = yesterdayMorning.format('MM'),
    startDay = yesterdayMorning.date(),
    endDay = startDay,
    waiting = 100,
} = commandLineArgs([
    { name: 'year', alias: 'y' },
    { name: 'month', alias: 'm' },
    { name: 'startDay', alias: 's' },
    { name: 'endDay', alias: 'e' },
    { name: 'waiting', alias: 'w' },
]);

console.log(JSON.stringify({ year, month, startDay, endDay }, null, 2));

async function loadDay(date) {
    let url = `${config.riaUrl}/services/${date}/more.html?id=0&date=${date}T235959`;
    while (url) {
        console.log('NEXT PORTION ->', url);
        try {
            let { links, nextUrl } = await loadDayPortion(url);
            url = nextUrl ? `${config.riaUrl}${nextUrl}` : null;

            await loadPosts(links);
            await wait(waiting);
        } catch (err) {
            console.log('GETTING -->', url);
            throw axios.isAxiosError(err) ? err.toJSON() : err;
        }
    }
}

runScript(async () => {
    const baseDate = `${year}${setLeadingZeros(month)}`;
    let day = Number(startDay)

    while (day <= endDay) {
        const date = baseDate + setLeadingZeros(day);
        try {
            await loadDay(date);
        } catch (error) {
            console.error(error);
            console.log('Scan stopped -->', date)
            break
        }
        day++;
    }
}, 'scan script');
