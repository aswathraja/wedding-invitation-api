// Author : Aswath Raja
// Scope : Initialize a ExpressJS API and bind the routers to the API.
// Import the necessary packages to initalize a ExpressJS API
const express = require("express");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require("./app/config/app.config");
const logger = require("./app/config/logger");
const path = require('path');
const fs = require("fs");
var cors_proxy = require('cors-anywhere');



// Gracefully handle interrupt signal and exit the process
process.on('SIGINT', function() {
	logger.info("Express API server has been successfully shutdown with an interrupt");
	process.exit();
});

// Gracefully handle terminate signal and exit the process
process.on('SIGTERM', function() {
	logger.info("Express API server has been successfully shutdown with a terminal signal");
	process.exit();
});

// Express App initalization
const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

// Initialize the logger
app.use(morgan(':method :url - :response-time ms with statusCode :status :body', { stream: logger.stream }));

// Initialize Helmet to prevent against know CSRF attacks
app.use(helmet());

// Enable compression on all routes
app.use(compression());

// Disable Headers to prevent ExpressJS detection in the App
app.disable('x-powered-by');

// Logging requests to the API and add required headers for static asset requests
app.use(async function(req,res,next) {
	res.setHeader("Content-Security-Policy","frame-src https://www.google.com");
	res.setHeader("Cross-Origin-Resource-Policy","cross-origin");
	if(req.originalUrl.includes("assets"))
	{
		res.setHeader("Cross-Origin-Resource-Policy","cross-origin");
		res.setHeader("Access-Control-Allow-Origin", "http://" + req.hostname);
	}
	next()
});


// Define Cross-Origin domains and other CORS options to be used by the app
let corsOptions = {
	origin: function (origin,callback) {
		if(/(^http:\/\/192\.168\.1\..*[:]*[0-9]*$)|(^http:\/\/localhost[:]*[0-9]*$)|(^http[s]*:\/\/aswathraja.com[:]*[0-9]*$)|(^http:\/\/[a-zA-Z0-9-]+.local([:0-9])*$)$/.test(origin))
		{
			// Allow localhost and local network domains
			callback(null, true);
		}
		else if(origin)
		{
			// Block any other external domains
			logger.error("Blocked Request from " + origin);
			callback(null,false);
		}
		else
		{
			callback(null,false);
		}
	},
};

// Assign the CORS options to the app
app.use(cors(corsOptions));

// Use cookie-parser to set and read cookies in the request and response
app.use(cookieParser(config.jwt_key));

// Parse requests of content-type: application/json
app.use(express.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));

// Initialize the DB Object through Sequelize
// const db = require("./app/models/index");

// The below code has been commented, it needs to be run only once when 
// there is a new model defined in the project

// db.sequelize.sync({alter:true});

// The below code has been commented, it needs to be run only if the tables
// can be dropped in the database and recreated as per the models defined.
// It drops the table if it already exists

// db.sequelize.sync({ force: true }).then(() => {
// logger.info("Drop and re-sync db.");
// });

// Base unauthenticated URL 
// app.get("/", (req, res) => {
// 	res.json({ message: "Welcome to Raja Home API." });
// 	return;
// });

// Include the routes defined in app/routes/*.js
require("./app/routes/rsvp.routes.js")(app);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
  
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
}).listen(82, "0.0.0.0", function() {
    console.log('Running CORS Anywhere on ' + '82');
});

// Define the port number to listen on and start the app.
const port = config.apiPort||81;
https.createServer({
	key: fs.readFileSync(config.SSL_KEY_PATH),
	cert: fs.readFileSync(config.SSL_CERT_PATH),
  },app).listen(port, () => logger.info("Express API listening on port : " + port + " with PID : " + process.pid + " and PPID : " + process.ppid ));
