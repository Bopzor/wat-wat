'use strict';

const movies = require('./db.movies.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('movies', movies, {})
        .catch(console.log);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('movies', null, {})
        .catch(console.log);
  },
};
