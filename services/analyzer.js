const {TABLE_NAME} = require('../models');

function getQuery(from, to, minCount) {
    return `
        SELECT
            to_char(day, 'YYYY-MM-DD') AS day,
    jsonb_agg(jsonb_build_object('keyword', keyword, 'count', count) ORDER BY count DESC) AS keywords_count
        FROM (
            SELECT
            date_trunc('day', ${TABLE_NAME.NEWS}."date") AS day,
            -- unnest(regexp_split_to_array(keywords, ',\\s*')) AS keyword,
            lower (replace(unnest(regexp_split_to_array(keywords, ',\\s*')), '.', '')) AS keyword,
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

module.exports = {
    getQuery
}
