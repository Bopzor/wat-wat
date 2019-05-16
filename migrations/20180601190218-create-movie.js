'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      plot: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      released: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      runtime: {
        allowNull: false,
        type: Sequelize.STRING
      },
      director: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      writer: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      actors: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      poster: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      place: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
      },
      seen: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      imdbId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('movies');
  },
};
