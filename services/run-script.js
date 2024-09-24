const { sequelize } = require('../models');

async function runScript(script, name = 'some script') {
    await sequelize.sync({ force: false })

    try {
        await script();
        console.log(name, 'success');
    } catch (error) {
        console.error(error);
        console.log(name, 'failed')
    }
    await sequelize.close()
}

module.exports = {
    runScript
}
