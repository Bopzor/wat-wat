'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('comment', {
	comment: DataTypes.STRING,
	author: DataTypes.STRING,
  }, {});

  Comment.associate = function(models) {
	Comment.belongsTo(models.Movie);
  };

return Comment;
};