'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable("TraversedLinks", {
            tid: { // pk
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
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });
    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.dropTable("TraversedLinks");

    }
};