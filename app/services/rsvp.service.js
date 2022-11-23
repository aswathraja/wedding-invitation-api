// Author : Aswath Raja
// Scope : Define the RSVP functions to save and retrieve RSVP details along with reservations and known guests.

// Import all the requires packages and project files
const db = require("../models/index");
const Op = db.Sequelize.Op;
const rsvps = db.rsvps;
const reservations = db.reservations;
const knownrsvps = db.knownrsvps;
const config = require("../config/app.config");
const logger = require("../config/logger");


// Scope : Authentication function for the 'login' endpoint
exports.retrieveRSVP = async (req, res) => {
	try{
			// Return 'Bad Request' response for any invalid request
			if (!req.body.phone && !req.body.email || (req.body.phone === '' && req.body.email === '')) {
				res.status(400).send({
					message: "Email or Phone number is invalid or missing",
					body:req.body
				});
				return;
			}
			var parsedConditions = []
			if(req.body.email.length > 0)
			{
				parsedConditions.push({'email':req.body.email})
			}
			if(req.body.phone.length > 0)
			{
				parsedConditions.push({'phone':req.body.phone})
				parsedConditions.push({'altphone':{[Op.like]: `%,${req.body.phone},%`}})
			}
			var condition = {[Op.or]: parsedConditions};
			rsvps.findOne({where: condition, include: [{model:reservations, as:'reservations'},{model:knownrsvps, include:[{model:rsvps, include: [reservations], attributes: {exclude: ['id','createdAt','updatedAt','invitecode']}}]}], attributes: {exclude: ['createdAt','updatedAt']}})
			.then(rsvp => {
				if(rsvp !== null)
				{
					res.status(200).send({
						rsvp:rsvp,
						newRSVP:false
					})
				}
				else
				{
					// Return 'Forbidden' response in case of invalid login credentials
					res.status(200).send({
						newRSVP: true
					});
					return;
				}
			})
			.catch(err => {
				// Return 'Internal Server Error' response in case of any server exceptions
				console.error(err)
				res.status(500).send({
					message: "Some error occurred while validating the RSVP request: " + err.message
				});
				return;
			});
	}
	catch(err)
	{
		console.error(err)
		res.status(500).send({
			message: "Some error occurred while validating the RSVP request: " + err.message
		});
		return;
	}
};

// Scope : Create a new 'RSVP' object and save it to the DB
exports.saveRSVP = (req, res) => {
	try {
			// Return 'Bad Request' response for any invalid request
			if (!req.body.name || !req.body.phone || !req.body.guests || !req.body.guesttype  || req.body.name === '' || req.body.phone === '' || req.body.guests === '' || req.body.guesttype === '') {
				res.status(400).send({
					message: "Content cannot be empty!"
				});
				return;
			}
			// Build a RSVP object to save from the request body
			const rsvpbody = {
				name: req.body.name,
				email: req.body.email ? req.body.email : '',
				phone: req.body.phone,
				altphone: req.body.altphone,
				guests: parseInt(req.body.guests),
				personalrequests:req.body.personalreqests && req.body.personalreqeusts.length > 0 ? req.body.persoanlrequests : ' ',
				guestType: req.body.guesttype,
				invitecode : Math.random() * (9999 - 1000) + 100
			};
			// Check if there is a RSVP saved using the phone number or email
			var condition = {[Op.or]: [{ phone: req.body.phone },{ email: req.body.email }]};
			rsvps.findOne({where: condition})
			.then(rsvp => {
				// If a saved RSVP detail is found, then update the same RSVP
				if(rsvp !== null)
				{
					rsvp.email = req.body.email ? req.body.email : '';
					rsvp.phone = req.body.phone;
					rsvp.guests = parseInt(req.body.guests);
					rsvp.personalrequests = req.body.personalrequests;
					rsvp.guesttype = req.body.guesttype;
					rsvp.altphone = req.body.altphone;
					rsvp.save();
					res.send(rsvp);
					return;
				}
				// If a saved RSVP detail is not found, then save the RSVP object as a new RSVP
				else
				{

					// Save the 'RSVP' object to the database
					rsvps.create(rsvpbody)
						.then(savedRSVP => {
							// Return success response with the 'RSVP' object after saving to the DB
							res.send(savedRSVP);
							return;
							
						})
						.catch(err => {
							logger.error(err)
							// Return 'Internal Server Error' response for any server exceptions
							res.status(500).send({
								message:
									err.message || "Some error occurred while creating the RSVP."
							});
							return;
						});
				}
			})
	}
	catch(err)
	{
		logger.error(err)
		// Return 'Internal Server Error' response for any server exceptions
		res.status(500).send({
			message: "Some error occurred while saving the RSVP " + err
		});
		return;
	}
};
