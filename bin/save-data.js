const fs = require('fs/promises');

const commandLineArgs = require('command-line-args');
const moment = require('moment');

const config = require('../configuration');
const { runScript } = require('../services/run-script');
const { sequelize } = require('../models');
const {getQuery} = require('../services/analyzer');

const  { setLeadingZeros } = require('../services/utils');

const todayMorning = moment();
const {
    year = todayMorning.format('YYYY'),
    month = todayMorning.format('MM'),
    startDay = todayMorning.date(),
    endDay = startDay,
} = commandLineArgs([
    { name: 'year', alias: 'y' },
    { name: 'month', alias: 'm' },
    { name: 'startDay', alias: 's' },
    { name: 'endDay', alias: 'e' },
    { name: 'waiting', alias: 'w' },
]);


function fileExists(path) {
    return fs.stat(path).then(() => true, () => false)
}

runScript(async () => {
    const from = `${year}-${setLeadingZeros(month)}-${setLeadingZeros(startDay)}`
    const to = `${year}-${setLeadingZeros(month)}-${setLeadingZeros(endDay)}`
    ;
    const query = getQuery(from, to, 0);
    const [ list] = await sequelize.query(query);

    for (let i = 0; i < list.length; i++) {
        const it = list[i];
        const filePame = `${config.files.destinationFolder}/${it.day}.json`;
        const exists = await fileExists(filePame);
        if (exists) {
            await fs.unlink(filePame)
        }
        await fs.writeFile(filePame, JSON.stringify({ keywords: it.keywords_count }, null, 4), 'utf8');
    }

}, 'Save files');
