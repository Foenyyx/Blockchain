// Libraries
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "axa_blockchain",
    multipleStatements: true
});

// Vars
const allowedIp = [
    '::ffff:127.0.0.1',
    '192.168.165.20',
    '::1',                    // Vincent
    '192.168.165.21',
    '::ffff:192.168.165.21',  // Alexy
    '::ffff:192.168.165.18',  // Stéphane
    '::ffff:192.168.165.23'   //  Ugo
];

// Test mysql connection
con.connect(function (err) {
    if (err) {
        throw (err);
    }
    console.log("Connected!");
});

// Functions

// Secure routes
function requireAuth(req, res, next) {
    //next();
    //console.log(allowedIp.indexOf(getUserIp(req)));
    if (req.query.authkey === "123456" || allowedIp.indexOf(getUserIp(req)) >= 0) {
        next(); // allow the next route to run
    } else {
        // Return 401 Unauthorized http status code
        res.sendStatus(401);
    }
}

// Get user ip 
function getUserIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

// Settings

// For parsing application/json
app.use(bodyParser.json());

// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Automatically apply the `requireLogin` middleware to all
// routes starting with `/admin`
app.use(['*'], requireAuth, function (req, res, next) {
    // if the middleware allowed us to get here,
    // just move on to the next route handler
    next();
});

//
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routes

// Homepage route
app.get('/', function (req, res) {
    let ip = getUserIp(req);
    res.send('Ca marche, voici ton ip ' + ip);
});

// 404 handler
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

// Errors handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Launch application
let server = app.listen(4443, function () {
    console.log('Example app listening on port 4443!');
});