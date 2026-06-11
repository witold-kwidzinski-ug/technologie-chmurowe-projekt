require('dotenv').config()
const {Pool} = require('pg')
const fs = require('fs')

const user = fs.readFileSync("/run/secrets/db_user", "utf-8").trim()
const password = fs.readFileSync("/run/secrets/db_password", "utf-8").trim()


const DB = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    user: user,
    password: password
})

module.exports = DB