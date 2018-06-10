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
        type: Sequelize.STRING,
      },
      plot: {
        type: Sequelize.STRING,
      },
      released: {
        type: Sequelize.STRING,
      },
      runtime: {
        type: Sequelize.INTEGER
      },
      director: {
        type: Sequelize.STRING,
      },
      writer: {
        type: Sequelize.STRING,
      },
      actors: {
        type: Sequelize.STRING,
      },
      poster: {
        type: Sequelize.STRING,
      },
      place: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      seen: {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('movies');
  },
};