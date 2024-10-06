const config = require('../configuration');
const { loadDayPortion, loadPosts } = require('../services/post-loader');
const { runScript } = require('../services/run-script');

// const START_DAY = 1;
// const LAST_DAY = 30;
const START_DAY = 21;
const LAST_DAY = 24;
const otherDate = '202409';

async function loadDay(date) {
    let url = `${config.riaUrl}/services/${date}/more.html?id=0&date=${date}T235959`;
    while (url) {
        console.log('NEXT PORTION ->', url);
        let { links, nextUrl } = await loadDayPortion(url);
        url = nextUrl ? `${config.riaUrl}${nextUrl}` : null;

        await loadPosts(links);
    }
}

runScript(async () => {
    let day = START_DAY

    while (day <= LAST_DAY) {
        const date = otherDate + String(day).padStart(2, '0');
        try {
            await loadDay(date);
        } catch (error) {
            console.error(error);
            console.log('Scan stopped', date)
            break
        }
        day++;
    }
}, 'scan script');
