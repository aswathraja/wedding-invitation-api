// Author : Aswath Raja
// Scope : Define the RSVP endpoints to save and retrieve RSVP details. 
//         Define the base RSVP route of the app.

module.exports = app => {
	// Import all the required packages and project files
	const rsvpservice = require("../services/rsvp.service.js");

	// Initialize a ExpressJS router 
	const router = require("express").Router();

	// Retrieve an RSVP along with any reservation details and Validate a new RSVP In 'POST' Request
	router.post("/retrieversvp", rsvpservice.retrieveRSVP);

	// Retrieve an RSVP along with any reservation details and Validate a new RSVP In 'POST' Request
	router.post("/searchguests", rsvpservice.retrieveRSVP);

	// Save a RSVP 'POST' Request
	router.post("/saversvp", rsvpservice.saveRSVP);

	// Base RSVP route
	app.use("/api/rsvp", router);
};