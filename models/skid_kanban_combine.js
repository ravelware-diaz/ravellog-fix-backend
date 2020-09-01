'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class skid_kanban_combine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get id() {
      return this.id
    }
    get epc_tag_id() {
      return this.epc_tag_id
    }
    get placement_tag_id() {
      return this.placement_tag_id
    }
    get batch_id() {
      return this.batch_id
    }
  };
  skid_kanban_combine.init({
    epc_tag_id: DataTypes.INTEGER,
    placement_tag_id: DataTypes.INTEGER,
    batch_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'skid_kanban_combine',
  });
  skid_kanban_combine.associate = function(models) {
    skid_kanban_combine.hasMany(models.skid_kanban_combine, { foreignKey: 'placement_tag_id' })
  }
  return skid_kanban_combine;
};