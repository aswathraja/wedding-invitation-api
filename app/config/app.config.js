// Author : Aswath Raja
// Scope : Define the DB and other API configuration keys
// DO NOT change any values other than what has been designated with  '<>' marks if you dont know what you are doing. 
// The API may not work as intended

// Import the required libraries and project files
module.exports = {
	HOST: "localhost",
	USER: "wedding",
	PASSWORD: "rightman",
	DB: "wedding",
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	httpsPort:3000,
	httpPort:3001,
	corsPort:3002,
	TOKEN_PATH:"<Enter the path to your token.json file from Google API>",
	CREDENTIALS_PATH:"<Enter the path to your credentials.json file from Google API>",
	logPath:"./logs/",
	SSL_CERT_PATH:"/home/ubuntu/ssl/aswathraja_com/aswathraja_com.crt",
	SSL_CA_PATH:"/home/ubuntu/ssl/aswathraja_com/aswathraja_com.ca-bundle",
	SSL_KEY_PATH:"/home/ubuntu/ssl/aswathraja.com.key"

};