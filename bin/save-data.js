const fs = require('fs/promises');

const config = require('../configuration');
const { runScript } = require('../services/run-script');
const { sequelize } = require('../models');
const {getQuery} = require('../services/analyzer');

const FROM = '2024-08-01';
const TO = '2024-11-01';

function fileExists(path) {
    return fs.stat(path).then(() => true, () => false)
}

runScript(async () => {
    const query = getQuery(FROM, TO, 0);
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
