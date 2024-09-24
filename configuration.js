module.exports = {
    riaUrl: process.env.RIA_RSS_URL,
    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    },
    openApi: {
        key: process.env.OPEN_API_KEY
    }
}
