module.exports = {
    apps : [{
        name   : 'ria-analyzer',
        script : './bin/www',
        node_args: '--env-file .env.development',
        ignore_watch: ['pgdata', '.idea', 'node_modules', 'http-client', 'views'],
        watch: true,
    }]
}
