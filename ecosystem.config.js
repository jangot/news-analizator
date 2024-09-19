module.exports = {
    apps : [{
        name   : "ria-analyzer",
        script : "./bin/www",
        node_args: '--env-file .env.development',
        watch: true,
    }]
}
