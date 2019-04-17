'use strict';

module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('movie', {
  	title: DataTypes.STRING,
  	plot: DataTypes.STRING,
  	released: DataTypes.STRING,
  	runtime: DataTypes.INTEGER,
  	director: DataTypes.STRING,
  	writer: DataTypes.STRING,
  	actors: DataTypes.STRING,
  	poster: DataTypes.STRING,
  	place: DataTypes.INTEGER,
  	seen: DataTypes.BOOLEAN,
  	imdbId: DataTypes.STRING,
  }, {
    timestamps: true,
    paranoid: true,
  });

  Movie.associate = function(db) {
  	Movie.hasMany(db.comment);
  };

  return Movie;
};
