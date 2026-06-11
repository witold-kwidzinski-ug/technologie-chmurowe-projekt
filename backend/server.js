const express = require("express")
const cors = require("cors")
const DB = require("./db")
const { RD, connectClient } = require("./rd")

const app = express()

app.use(cors(), express.json())

const startTime = Date.now()


app.get("/items", async (req, res) => {
    try {
        const cached = await RD.get("games");

        if (cached) {
            res.set("X-Cache", "HIT")
            res.send(JSON.parse(cached))
            return
        }
    } catch (err) {
        console.log("Cache not found.")
    }

    try {
        const items = await DB.query("SELECT (name) FROM games")
        await RD.setEx("games", 10, JSON.stringify(items.rows))
        res.set("X-Cache", "MISS")
        res.send(items.rows)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post("/items", async (req, res) => {
    const name = req.body.name
    await DB.query(`INSERT INTO games (name) VALUES ($1)`, [name])

    const record = await DB.query('SELECT * FROM games WHERE name=$1', [name])

    await RD.del("games");
    res.send(record.rows[0])

})


app.get("/health", async (req, res) => {
    const resObj = {status: "ok", uptime: Math.floor((Date.now() - startTime) / 1000)}

    try {
        await DB.query('SELECT 1 FROM games')
        resObj.postgres = true
    } catch (err) {
        resObj.postgres = false
    }

    try {
        await RD.ping()
        resObj.redis = true
    } catch (err) {
        resObj.redis = false
    }
    

    res.json(resObj)
})

async function start() {
    try {
        await connectClient()
        process.on("SIGTERM", () => shutdown("SIGTERM"))
        process.on("SIGINT", () => shutdown("SIGINT"))
        app.listen(3000, () => console.log("Backend started at http://localhost:3000"))
    } catch (err) {
        console.log(err)
    }
}
async function shutdown(signal) {
    console.log(`Received ${signal}`)

    try {
        await DB.end()
        console.log("Postgres disconnected")

        await RD.quit()
        console.log("Redis disconnected")

        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start()