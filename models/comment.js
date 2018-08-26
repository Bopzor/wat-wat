'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
  	comment: DataTypes.STRING,
  	author: DataTypes.STRING,
  }, {
    timestamps: true,
    paranoid: true,
  });

  Comment.associate = function(db) {
    Comment.belongsTo(db.movie);
  };

  return Comment;
};
