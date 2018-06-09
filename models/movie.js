'use strict';
module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define('movie', {
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
  }, {});

  Movie.associate = function(models) {
	Movie.hasMany(models.Comment);
  };

  return Movie;
};