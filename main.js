const express = require("express");
const settings = require("./settings.json");
const mysql = require("mysql");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public/"));

app.get("/", (req, res) => {
    res.render("main");
});

const con = mysql.createConnection({
    host: settings["host"],
    user: settings["username"],
    password: settings["password"],
    database: settings["database"]
});

app.get("*", (req, res) => {
    const shortenedURL = req.originalUrl.substring(1);
    con.query("SELECT * FROM shortened WHERE shortened = " + con.escape(shortenedURL), (err, rows) => {
        if(err) throw err;
        if(!rows.length) { res.render("notfound"); res.status(404); return }
        res.redirect(rows[0].url)
    })
});

app.listen(25565)