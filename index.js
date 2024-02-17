// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express'); // Web framework for Node.js
const mongoose = require('./configs/mongoose'); // MongoDB config file is called to initiate DB connection
const cors = require('cors')
const defaultLog = require('./middlewares/defaultLog')
const https = require('https');
const http = require('http');
const fs = require('fs');

// Create an instance of the Express application
const app = express();

app.use(cors())
app.use(defaultLog.defaultLog) //To log each request and ip

// Use middleware to parse incoming requests
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
const passport = require('passport')
const passportJWT = require('./configs/passport-jwt')

// Import and use routes defined in separate modules
app.use('/', require('./routes'));

// HTTP setup
const httpPort = process.env.HTTP_PORT || 8000;
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server started on port ${httpPort}`);
});

// HTTPS setup
const httpsPort = process.env.HTTPS_PORT || 8443;
const cert = fs.readFileSync('/certificates/certificate.crt', 'utf-8');
const key = fs.readFileSync('/certificates/private.key', 'utf-8');
const httpsParams = {
  key: key,
  cert: cert
};

const httpsServer = https.createServer(httpsParams, app);

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server started on port ${httpsPort}`);
});