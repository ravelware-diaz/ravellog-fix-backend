const { kanban_tag } = require('../models')

class KanbanTagController {
    static insert(data, t) {
        return kanban_tag.bulkCreate(data, { transaction: t })
    }
}

module.exports = KanbanTagController