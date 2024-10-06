const express = require('express');
const { sequelize, TABLE_NAME } = require('../models');
const moment = require('moment');

const router = express.Router();

function getQuery(from, to) {
    return `
        SELECT
            day,
            jsonb_agg(jsonb_build_object('keyword', keyword, 'count', count)) AS keywords_count
        FROM (
            SELECT
            date_trunc('day', ${TABLE_NAME.NEWS}."date") AS day,
            unnest(string_to_array(keywords, ',')) AS keyword,
            COUNT(*) AS count
            FROM
            ${TABLE_NAME.NEWS}
            WHERE
            ${TABLE_NAME.NEWS}."date" >= '${from}' AND ${TABLE_NAME.NEWS}."date" < '${to}'
            GROUP BY
            day, keyword
            ) AS subquery
        GROUP BY
            day
        ORDER BY
            day;
    `
}

router.get('/:from/:to', async function(req, res, next) {
    const from = moment(req.params.from).format('YYYY-MM-DD');
    const to = moment(req.params.to).format('YYYY-MM-DD');

    try {
        // const query = getQuery('2024-09-01', '2024-10-01');
        const query = getQuery(from, to);
        console.log(query)
        const [ data] = await sequelize.query(query);
        console.log(data)
        res.render('analyzer', { title: 'Analyzer' });
    } catch (error) {
        res.render('error', { error, message: 'Query error' });
    }

});

module.exports = router;
