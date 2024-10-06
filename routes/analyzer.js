const express = require('express');
const { sequelize, TABLE_NAME } = require('../models');
const moment = require('moment');

const router = express.Router();

function getQuery(from, to, minCount) {
    return `
        SELECT
            to_char(day, 'YYYY-MM-DD') AS day,
    jsonb_agg(jsonb_build_object('keyword', keyword, 'count', count) ORDER BY count DESC) AS keywords_count
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
        WHERE
            count > ${minCount}
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
        const minCount = req.query.min ? Number(req.query.min) : 10;

        const query = getQuery(from, to, minCount);
        const [ data] = await sequelize.query(query);
        res.render('analyzer', { title: 'Analyzer', data });
    } catch (error) {
        res.render('error', { error, message: 'Query error' });
    }

});

module.exports = router;
