const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

module.exports = sequelize.define("TraversedLinks", {
    tid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    sid: { // foreign key
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    traversedLink: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
    }
});