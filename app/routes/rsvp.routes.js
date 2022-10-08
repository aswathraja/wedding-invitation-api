// Author : Aswath Raja
// Scope : Define the authentication endpoints to login and verify a token. 
//         Define the base authentication route of the app.

module.exports = app => {
	// Import all the required packages and project files
	const rsvpservice = require("../services/rsvp.service.js");

	// Initialize a ExpressJS router 
	const router = require("express").Router();

	// Retrieve an RSVP along with any reservation details and Validate a new RSVP In 'POST' Request
	router.post("/retrieversvp", rsvpservice.retrieveRSVP);

	// Save a RSVP 'POST' Request
	router.post("/saversvp", rsvpservice.saveRSVP);

	// Base authentication route
	app.use("/api/rsvp", router);
};