const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

module.exports = sequelize.define("SeedLinks", {
    sid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    seedLink: Sequelize.STRING(1000),
});