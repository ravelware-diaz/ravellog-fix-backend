'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class skid_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get id() {
      return this.id
    }
    get date_in() {
      return this.date_in
    }
    get epc_tag_id() {
      return this.epc_tag_id
    }
  };
  skid_tag.init({
    date_in: DataTypes.DATE,
    epc_tag_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'skid_tag',
  });

  skid_tag.associate = function(models) {
    skid_tag.belongsTo(models.epc_tag, { foreignKey: 'epc_tag_id' })
    skid_tag.hasMany(models.kanban_tag, { foreignKey: 'skid_tag_id' })
  }
  return skid_tag;
};