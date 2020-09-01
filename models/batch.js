'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class batch extends Model {
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
  };
  batch.init({
    date_in: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'batch',
  });
  batch.associate = function(models) {
    batch.hasMany(models.skid_kanban_combine, { foreignKey: 'batch_id' })
  }
  return batch;
};