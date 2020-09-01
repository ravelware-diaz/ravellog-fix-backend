'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('skid_kanban_combines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      epc_tag_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'epc_tags',
          key: 'id'
        }
      },
      placement_tag_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'skid_kanban_combines',
          key: 'id'
        }
      },
      batch_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'batches',
          key: 'id'
        }
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
    await queryInterface.dropTable('skid_kanban_combines');
  }
};