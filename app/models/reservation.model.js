// Author : Aswath Raja
// Scope : Define the 'Reservation' modal object

module.exports = (sequelize, Sequelize) => {

	const Reservation = sequelize.define("reservation", {
		hotelname: {
			type: Sequelize.STRING,
			allowNull:true
		},
		hoteladdress: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		roomNum: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		hotelcontact: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		hotelphone: {
			type: Sequelize.BIGINT,
			allowNull: true,
		},
		transportcontact: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		transportphone: {
			type: Sequelize.BIGINT,
			allowNull: true,
		},
		hotelmaplink: {
			type: Sequelize.STRING,
			allowNull: true,
		}

	},
	{
		tableName: 'reservations'
	});

	return Reservation;
};