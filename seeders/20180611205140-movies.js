'use strict';

const movies = require('./db.movies.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('movies', movies, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('movies', null, {});
  },
};
