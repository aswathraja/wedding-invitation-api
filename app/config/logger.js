var winston = require('winston');
var config = require("./app.config")
// define the custom settings for each transport (file, console)
var options = {
  info: {
	 level: 'info',
	 filename: config.logPath + "Wedding-Invite-API.stdout",
	 handleExceptions: true,
	 format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(info => `${
			 new Date(info.timestamp).toLocaleString('en-IN').replace(",","").toLocaleUpperCase()
		  } [${
			 info.level.toLocaleUpperCase()
		  }] ${
			 info.message
		  }`
		),
	 ),
	 json: false,
	 maxsize: 5242880, // 5MB
	 maxFiles: 5,
  },
  error: {
	 level: 'error',
	 filename: config.logPath + "Wedding-Invite-API.stderr",
	 handleExceptions: true,
	 format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.printf(console => `${
			 new Date(console.timestamp).toLocaleString('en-IN').replace(",","").toLocaleUpperCase()
		  } [${
			 console.level.toLocaleUpperCase()
		  }] ${
			 console.message
		  }`
		),
	 ),
	 json: false,
	 maxsize: 5242880, // 5MB
	 maxFiles: 5,
  },
  console: {
	 handleExceptions: true,
	 format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.printf(error => `${
			 new Date(error.timestamp).toLocaleString('en-IN').replace(",","").toLocaleUpperCase()
		  } [${
			 error.level.toLocaleUpperCase()
		  }] ${
			 error.message
		  }`
		),
	 ),
	 json: false,
  }
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
  transports: [
	 new winston.transports.File(options.info),
	 new winston.transports.File(options.error),
	 new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
	 try {
			message = message.split("with statusCode")
			var status = message.length > 1 ? parseInt(message[1].trim()) : undefined
			message = message[0].trim()
			if(status && status >= 400)
			{
				logger.error(message.trim())
			}
			else
			{
				logger.info(message.trim())
			}
			if(message.includes("Error") || message.includes("Exception"))
			{
				logger.error(message)
			}
	 	}
		catch(err)
		{
			logger.error(err)
		}
  },
};

module.exports = logger;