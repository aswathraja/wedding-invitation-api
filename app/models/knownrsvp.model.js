// Author : Aswath Raja
// Scope : Define the 'KnownRSVP' modal object

module.exports = (sequelize, Sequelize) => {

	const knownRSVP = sequelize.define("knownrsvp", {
		knownGuestId: {
			type: Sequelize.INTEGER,
			allowNull:false
		},
		rsvpId: {
			type: Sequelize.INTEGER,
			allowNull:false
		},
	},
	{
		tableName: 'knownrsvps'
	});

	return knownRSVP;
};