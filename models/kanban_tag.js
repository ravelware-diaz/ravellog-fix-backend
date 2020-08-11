'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kanban_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get id() {
      return this.id
    }
    get skid_tag_id() {
      return this.skid_tag_id
    }
    get epc_tag_id() {
      return this.epc_tag_id
    }
    get date_in() {
      return this.date_in
    }
  };
  kanban_tag.init({
    skid_tag_id: DataTypes.INTEGER,
    epc_tag_id: DataTypes.INTEGER,
    date_in: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'kanban_tag',
  });
  kanban_tag.associate = function(models) {
    kanban_tag.belongsTo(models.epc_tag, { foreignKey: 'epc_tag_id' })
    kanban_tag.belongsTo(models.skid_tag, { foreignKey: 'skid_tag_id' })
  }
  return kanban_tag;
};