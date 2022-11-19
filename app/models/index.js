// Author : Aswath Raja
// Scope : Read the configuration from the App Config and initialize a 
//         DB Object with Sequelize Pooling and Session management mechanism

const config = require("../config/app.config");

const Sequelize = require("sequelize");
const logger = require("../config/logger");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
	host: config.HOST,
	dialect: config.dialect,
	operatorsAliases: 0,
	logging: logger.info.bind(logger),
	pool: {
		max: config.pool.max,
		min: config.pool.min,
		acquire: config.pool.acquire,
		idle: config.pool.idle
	}
});

// Initialize the DB Object
const db = {};

// Add the Sequlize library and the connection configuration 
// object to the DB Object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add the modal definition constructors with the Sequelize connection
// to the DB Object
db.rsvps = require("./rsvp.model.js")(sequelize, Sequelize);
db.reservations = require("./reservation.model.js")(sequelize, Sequelize);
db.knownrsvps = require("./knownrsvp.model.js")(sequelize, Sequelize);

// Reservations Associations
db.rsvps.hasMany(db.reservations);
db.reservations.belongsTo(db.rsvps);

// Known Guests Associations
db.rsvps.hasMany(db.knownrsvps);
db.knownrsvps.belongsTo(db.rsvps);
db.knownrsvps.hasOne(db.rsvps,{foreignKey: "id",
targetKey: "knownGuestId"});
db.knownrsvps.belongsTo(db.rsvps,{foreignKey: "knownGuestId",
targetKey: "id"});

module.exports = db;