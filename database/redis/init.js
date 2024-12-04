const { createClient } = require('redis')
const client = createClient({
    password: global.config.database.redis.password,
    socket: {
        host: global.config.database.redis.uri,
        port: global.config.database.redis.port
    }
}).connect()

module.exports = { client }