// Author : Aswath Raja
// Scope : Define the 'RSVP' modal object

module.exports = (sequelize, Sequelize) => {

	const RSVP = sequelize.define("rsvp", {
		name: {
			type: Sequelize.STRING,
			allowNull:false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		guests: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		phone: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		personalrequests: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		altphone: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		guesttype: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		invitecode: {
			type: Sequelize.INTEGER,
			allowNull: false
		},

	},
	{
		tableName: 'rsvps'
	});

	return RSVP;
};