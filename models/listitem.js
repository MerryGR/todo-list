'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListItem extends Model {

    static associate(models) {
      ListItem.belongsTo(models.List, {
        foreignKey: 'listId',
        onDelete: 'CASCADE'
      });
    }
  }
  ListItem.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    deadline: DataTypes.DATE,
    creator: DataTypes.STRING,
    flag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ListItem',
  });
  return ListItem;
};