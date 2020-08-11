const { kanban_tag, epc_tag } = require('../models')

class KanbanTagController {
    static insert(data, t) {
        console.log(data)
        return kanban_tag.bulkCreate(data, { transaction: t })
    }
}

module.exports = KanbanTagController