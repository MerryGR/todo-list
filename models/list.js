'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {

    static associate(models) {
      List.hasMany(models.ListItem, {
        foreignKey: 'listId',
        onDelete: 'CASCADE'
      });
      List.belongsToMany(models.User, {
        through: 'UserLists',
        onDelete: 'CASCADE'
      });
    }
  }
  List.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};