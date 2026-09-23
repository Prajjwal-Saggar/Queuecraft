const {Queue} = require("bullmq")
const createRedisConnection  = require("../config/redis.config")

const imageQueue = new Queue("image-processing" , {
    connection : createRedisConnection()
})

module.exports = imageQueue