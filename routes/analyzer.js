const express = require('express');
const { sequelize } = require('../models');
const moment = require('moment');

const { getQuery } = require('../services/analyzer');

const router = express.Router();

router.get('/:from/:to', async function(req, res, next) {
    const from = moment(req.params.from).format('YYYY-MM-DD');
    const to = moment(req.params.to).format('YYYY-MM-DD');

    try {
        const minCount = req.query.min ? Number(req.query.min) : 10;

        const query = getQuery(from, to, minCount);
        const [ data] = await sequelize.query(query);
        res.render('analyzer', { title: 'Analyzer', data });
    } catch (error) {
        res.render('error', { error, message: 'Query error' });
    }

});

module.exports = router;
