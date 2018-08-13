'use strict';

const movies = require('./db.movies.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
      console.log(`inserting ${movies.length} movies`);
      return queryInterface.bulkInsert('movies', movies, {})
        .catch(console.log);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('movies', null, {})
        .catch(console.log);
  },
};
