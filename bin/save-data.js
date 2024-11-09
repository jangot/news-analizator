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
    from,
    to
} = commandLineArgs([
    { name: 'from', alias: 'f' },
    { name: 'to', alias: 't' }
]);

runScript(async () => {
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
