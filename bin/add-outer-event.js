const commandLineArgs = require('command-line-args');
const fs = require('fs/promises');
const moment = require('moment');

const { runScript } = require('../services/run-script');
const config = require('../configuration');
const { fileExists } = require('../services/utils');

const { date, description } = commandLineArgs([
    { name: 'date', type: (v) => new Date(v), },
    { name: 'description', alias: 'd', type: String },
]);

runScript(async () => {
    if (!description) {
        throw new Error('No description');
    }
    const fileName = config.files.outerDestinationFolder + '/explosions.json';
    const exists = await fileExists(fileName);
    const json = exists ? await fs.readFile(fileName, 'utf-8') : '[]';
    const data = JSON.parse(json);

    data.push({ date: moment(date).format('YYYY-MM-DD'), description });

    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    await fs.unlink(fileName);

    await fs.writeFile(fileName, JSON.stringify(data, null, 4), 'utf8');
}, 'Add event');
