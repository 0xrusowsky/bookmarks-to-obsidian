import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as fs from 'fs';
import * as https from 'https';
import * as routes from "./routes/router";

dotenv.config();
const PORT = parseInt(process.env.SERVER_PORT, 10);
const key = fs.readFileSync('./CA/localhost/localhost.decrypted.key');
const cert = fs.readFileSync('./CA/localhost/localhost.crt');

const app = express();

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));

// Configure routes
routes.register(app);

app.get("/", (request, response) => {
    response.render("index")
})

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});