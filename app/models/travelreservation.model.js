// Author : Aswath Raja
// Scope : Define the 'TravelReservation' modal object

module.exports = (sequelize, Sequelize) => {

	const TravelReservation = sequelize.define("travelreservation", {
		trainname: {
			type: Sequelize.STRING,
			allowNull:true
		},
		journeytime: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		startlocation: {
			type: Sequelize.STRING,
			allowNull:false
		},
		endlocation: {
			type: Sequelize.STRING,
			allowNull:false
		},
		traveltype: {
			type: Sequelize.STRING,
			allowNull:false
		}

	},
	{
		tableName: 'travelreservations'
	});

	return TravelReservation;
};