'use strict';

module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('comment', {
  	comment: DataTypes.STRING,
  	author: DataTypes.STRING,
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
  });

  Comment.associate = function(db) {
    Comment.belongsTo(db.movie);
  };

  return Comment;
};
