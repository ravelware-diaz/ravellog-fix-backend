'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class epc_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get id() {
      return this.id
    }
    get epc_id() {
      return this.epc_id
    }
    get name() {
      return this.name
    }
    get quantity() {
      return this.quantity
    }
    get cycle() {
      return this.cycle
    }
    get status() {
      return this.status
    }
    get category() {
      return this.category
    }
  };
  epc_tag.init({
    epc_id: DataTypes.STRING,
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    cycle: DataTypes.INTEGER,
    status: DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'epc_tag',
  });
  epc_tag.associate = function(models) {
    epc_tag.hasMany(models.kanban_tag, { foreignKey: 'epc_tag_id' })
    epc_tag.hasMany(models.skid_tag, { foreignKey: 'epc_tag_id' })
  }

  return epc_tag;
};