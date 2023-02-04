import dotenv from "dotenv";
import express from "express";
import session from "express-session"
import path from "path";
import * as fs from 'fs';
import * as https from 'https';
import routes from "./routes/router";
export * as utils from "./utils"

dotenv.config()
const PORT = parseInt(process.env.SERVER_PORT, 10)
const key = fs.readFileSync('./CA/localhost/localhost.decrypted.key')
const cert = fs.readFileSync('./CA/localhost/localhost.crt')

const app = express()

// Configure Express to use EJS
app.set("views", path.join(__dirname, "../public/views"))
app.set("view engine", "ejs")

// Register middleware
app.use(express.static("public"))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded())

app.use((req, res, next) => {
    console.log(`${req.method}:${req.url}`)
    next()
})

app.use(session({
    secret: 'a lil project to synch my bookmarks',
    resave: false,
    saveUninitialized: false
}))

app.use(routes)

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});