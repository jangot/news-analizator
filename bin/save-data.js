const fs = require('fs/promises');

const commandLineArgs = require('command-line-args');
const moment = require('moment');

const config = require('../configuration');
const { runScript } = require('../services/run-script');
const { sequelize } = require('../models');
const { getQuery } = require('../services/analyzer');

const  { setLeadingZeros, fileExists } = require('../services/utils');

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

runScript(async () => {
    const from = `${year}-${setLeadingZeros(month)}-${setLeadingZeros(startDay)}`
    const to = `${year}-${setLeadingZeros(month)}-${setLeadingZeros(endDay)}`
    ;
    const query = getQuery(from, to, 0);
    // console.log(query)
    const [ list] = await sequelize.query(query);

    for (let i = 0; i < list.length; i++) {
        const it = list[i];
        const fileName = `${config.files.riaDestinationFolder}/${it.day}.json`;
        const exists = await fileExists(fileName);
        if (exists) {
            await fs.unlink(fileName)
        }
        await fs.writeFile(fileName, JSON.stringify({ keywords: it.keywords_count }, null, 4), 'utf8');
    }

}, 'Save files');
