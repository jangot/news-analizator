const { fs } = require('fs/promises');

const config = require('../configuration');
const { runScript } = require('../services/run-script');
const { sequelize } = require('../models');
const {getQuery} = require('../services/analyzer');

const FROM = '2024-09-01';
const TO = '2024-09-10';

runScript(async () => {
    const query = getQuery(FROM, TO, 0);
    const [ list] = await sequelize.query(query);

    

}, 'Save files');
