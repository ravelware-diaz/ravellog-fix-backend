'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kanban_tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skid_tag_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'skid_tags',
          key: 'id'
        }
      },
      epc_tag_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'epc_tags',
          key: 'id'
        }
      },
      date_in: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kanban_tags');
  }
};