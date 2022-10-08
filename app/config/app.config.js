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
	apiPort:"81",
	TOKEN_PATH:"<Enter the path to your token.json file from Google API>",
	CREDENTIALS_PATH:"<Enter the path to your credentials.json file from Google API>",
	logPath:"./logs/",
};