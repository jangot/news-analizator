const { sequelize } = require('../models');
const config = require('../configuration');
const {loadDayPortion, loadPosts} = require('../services/post-loader');
const moment = require('moment')


// const START_DAY = 1;
// const LAST_DAY = 30;
const START_DAY = 3;
const LAST_DAY = 10;
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
async function run() {
    await sequelize.sync({ force: false })
    let day = START_DAY

    while (day <= LAST_DAY) {
        const date = otherDate + String(day).padStart(2, '0');
        await loadDay(date);
        day++;
    }

    console.log('Scan was finished');
}
run()
    .then(() => {
        console.log('Success');
    })
    .catch((error) => {
        console.error(error);
        console.log('Fail')
    });
