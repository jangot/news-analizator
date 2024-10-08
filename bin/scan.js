const axios = require('axios');
const moment = require('moment');
const commandLineArgs = require('command-line-args');

const config = require('../configuration');
const { loadDayPortion, loadPosts } = require('../services/post-loader');
const { runScript } = require('../services/run-script');

const todayMorning = moment();
const {
    year = todayMorning.format('YYYY'),
    month = todayMorning.format('MM'),
    startDay = todayMorning.date(),
    endDay = startDay,
    waiting = 100,
} = commandLineArgs([
    { name: 'year', alias: 'y' },
    { name: 'month', alias: 'm' },
    { name: 'startDay', alias: 's' },
    { name: 'endDay', alias: 'e' },
    { name: 'waiting', alias: 'w' },
]);

function wait(time) {
    console.log('waiting', time);
    return new Promise((resolve) => {
        setTimeout(resolve, Number(time));
    });
}

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
    const baseDate = `${year}${month}`;
    let day = Number(startDay)

    while (day <= endDay) {
        const date = baseDate + String(day).padStart(2, '0');
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
