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
	res.setHeader("Content-Security-Policy","frame-src https://aswathraja.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://aswathraja.com/static/* https://*.googleapis.com https://*.gstatic.com *.google.com https://*.ggpht.com *.googleusercontent.com blob:;img-src 'self' https://*.googleapis.com https://*.gstatic.com *.google.com  *.googleusercontent.com data:;frame-src *.google.com;connect-src 'self' https://*.googleapis.com *.google.com https://*.gstatic.com  data: blob:;font-src https://aswathraja.com/static/* https://fonts.gstatic.com;style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;worker-src blob:; object-src 'none'");
	res.setHeader("Access-Control-Allow-Origin", "https://" + req.hostname);
	if(req.originalUrl.includes("assets"))
	{
		res.setHeader("Cross-Origin-Resource-Policy","cross-origin");
		res.setHeader("Access-Control-Allow-Origin", "https://" + req.hostname);
	}
	next();
});


// Define Cross-Origin domains and other CORS options to be used by the app
let corsOptions = {
	origin: function (origin,callback) {
		if(/(http)[s]*(\:\/\/)((192\.168\.1\.[0-9]{1,3}(\:[0-9]{0,4})*)|((www\.){0,1}(aswathraja\.com)(\:[0-9]{0,4})*)|((localhost)(\:[0-9]{0,4})*)|(([a-zA-Z]+)(\.local)(\:[0-9]{0,4})*))$/.test(origin))
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

app.use((req,res,next) => {
	if(req.protocol === 'http')
	{
		res.redirect(301,`https://` + req.headers.host + req.url );
		return;
	}
	next();
});

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

// Include the routes defined in app/routes/*.js
require("./app/routes/rsvp.routes.js")(app);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Define the port number to listen on and start the app.
const httpsPort = config.httpsPort||3000;
const httpPort = config.httpPort||3001;

https.createServer({
	cert: fs.readFileSync(config.SSL_CERT_PATH),
	ca: fs.readFileSync(config.SSL_CA_PATH),
	key: fs.readFileSync(config.SSL_KEY_PATH),
  },app).listen(httpsPort, () => logger.info("Express API listening on HTTPS port : " + httpsPort + " with PID : " + process.pid + " and PPID : " + process.ppid ));

app.listen(httpPort, () => logger.info("Express API listening on HTTP port : " + httpPort + " with PID : " + process.pid + " and PPID : " + process.ppid ))
