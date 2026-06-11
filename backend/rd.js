require('dotenv').config()
const { createClient } = require('redis')

const redisHost = process.env.REDIS_HOST || "localhost"

const RD = createClient({url: `redis://${redisHost}:6379`})

RD.on("error", (err) => console.log(err))


async function connectClient() {
    if (!RD.isOpen) {
        await RD.connect()
        console.log("Connected to redis.")
    }
}


module.exports = {RD, connectClient}