// Author : Aswath Raja
// Scope : Define the Authentication functions to login and verify a token. 
//         Define private functions to create a new user session

// Import all the requires packages and project files
const axios = require('axios');
const db = require("../models/index");
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
const rsvps = db.rsvps;
const reservations = db.reservations;
const jwt = require('jsonwebtoken');
const moment = require('moment') 
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
			var condition = {[Op.or]: [{ phone: req.body.phone.length > 0 ? req.body.phone : undefined },{ email: req.body.email.length > 0? req.body.email : undefined }]};
			console.log("condition",condition)
			rsvps.findOne({where: condition,include:reservations})
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
			if (!req.body.name || !req.body.phone || !req.body.guests  || req.body.name === '' || req.body.phone === '' || req.body.guests === '') {
				res.status(400).send({
					message: "Content cannot be empty!"
				});
				return;
			}
			const rsvpbody = {
				name: req.body.name,
				email: req.body.email ? req.body.email : '',
				phone: req.body.phone,
				guests: parseInt(req.body.guests),
				personalrequests:req.body.personalreqests && req.body.personalreqeusts.length > 0 ? req.body.persoanlrequests : ' ',
				invitecode : Math.random() * (9999 - 1000) + 100
			};
			// axios.post("https://script.google.com/macros/s/AKfycbxUvzB3I3v2ZO10OZCsQTB_d9Edgxu0cDWHNemAD9P4_gbPn1UzrBaGU-CivqwdAeK6dg/exec",rsvpbody).then(response => {
				// console.log("response body",response.body)				
				var condition = {[Op.or]: [{ phone: req.body.phone },{ email: req.body.email }]};
				rsvps.findOne({where: condition})
				.then(rsvp => {
					if(rsvp !== null)
					{
						rsvp.email = req.body.email ? req.body.email : ''
						rsvp.phone = req.body.phone
						rsvp.guests = parseInt(req.body.guests);
						rsvp.personalrequests = req.body.personalrequests;
						rsvp.save();
						res.send(rsvp);
						return;
					}
					else
					{
				// // Create a 'RSVP' object
				// const rsvp = {
				// 	name: req.body.name,
				// 	email: req.body.email ? req.body.email : '',
				// 	phone: req.body.phone,
				// 	guests: parseInt(req.body.guests),
				// 	personalrequests:req.body.personalreqests ? req.body.persoanlrequests : ''
				// };

				// Save the 'RSVP' object to the database
				rsvps.create(rsvpbody)
					.then(savedRSVP => {
						// Return success response with the 'Device' object after saving to the DB
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
		// });
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

// Scope : Logout function which deletes token and ends the session
exports.logout = async (req, res) => {
	try {
			// Return 'Bad Request' response for any invalid request
			if (!req.get("Authorization") || !req.get("Authorization").includes("Bearer ")) {
				res.status(400).send({
					message: "Authorization header is missing or invalid"
				});
				return;
			}
			// Get the Auth Token and remove it from the sessions table and return
			// success response
			var authheader = req.get("Authorization").split("Bearer ");
			var token = authheader[1];
			var condition = {'token':token};
			sessions.destroy({
				where: condition,
				truncate: false
			}).catch(err => {
				logger.error(err)
				res.status(500).send({
					message: err.message || "Some error occurred while Logging out the user"
				});
				return;
			}).then(status => {
				res.status(200).send("Successfully logged out")
				return;
			})
	}
	catch(err) {
		logger.error(err)
		res.status(500).send({
			message: "Some error occurred while logging out the user. " + err.message
		});
		return;
	}
};

// Scope : Common base function to authenticate every request 
//         to the protected routes.
exports.verifyToken = async (req) => {
	try {
			var authheader = req.get("Authorization").split("Bearer ");
			var token = authheader[1];
			const decoded = jwt.verify(token, config.jwt_key);
			var condition = {[Op.and]: [{token:token},
											{expiry :{[Op.gt]: moment().toDate()}}]};
			var session = await sessions.findAll({where:condition});
			if(session.length === 1)
			{
				return decoded;
			}
			else
			{
				return;
			}
			}
			catch(err)
			{
				return;
			}
};

// Scope : Private function to create a new user session from 
//         the 'authenticate' function. Clear all previous session for 
//         the user. Return the response with the 'Authorization' header and
//         'token' cookie
function createNewSession(userId,username,displayname,res) {
	try{
			var condition = {userId:userId};
			sessions.destroy({
					where: condition,
					truncate: false
			})
			.then(status => {
					var token = jwt.sign({ sub: userId }, config.jwt_key, { expiresIn: '1d' });
					const newsession = {
					"userId" : userId,
					"token" : token,
					"expiry" : moment().add(1, 'days').toDate()
					}
					sessions.create(newsession)
					.then(async (session) => {
							const assignedViews = await db.sequelize.query("CALL getUserViews(" + userId + ");", { type: QueryTypes.RAW});
							res.cookie('token',token,{httpOnly: true,sameSite:true,signed:true,overwrite:true,maxAge:86400,expires:moment().add(1, 'days').toDate()})
							res.cookie("username",username)
							res.set("Authorization","Bearer " + token)
							res.set("Access-Control-Allow-Origin","*")
							const response = {"token":token,"username":username,"displayname":displayname,"assignedViews":assignedViews}
							res.status(200).send(response);
							return;
					})
			})
	}
	catch(err)
	{
		logger.error(err)
		res.status(500).send({message:"Some error occured while creating a new session"});
		return;
	}
}