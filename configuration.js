module.exports = {
    riaUrl: process.env.RIA_RSS_URL,
    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
    },
    openApi: {
        key: process.env.OPEN_API_KEY
    },
    files: {
        riaDestinationFolder: process.env.NEWS_STATIC_DATA_PATH + '/data/ria',
        outerDestinationFolder: process.env.NEWS_STATIC_DATA_PATH + '/data/outer'
    },
    apiNews: {
        url: process.env.NEWS_API_URL,
        key: process.env.NEWS_API_KEY,
    }
}
