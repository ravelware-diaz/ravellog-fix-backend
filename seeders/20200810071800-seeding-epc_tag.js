'use strict';
const fs = require('fs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = fs.readFileSync('./epc_tag.json', 'utf-8')
    data = JSON.parse(data).map(el => {
      el.updatedAt = new Date()
      el.createdAt = new Date()
      return el
    })
    return queryInterface.bulkInsert('epc_tags', data, {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('epc_tags', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
