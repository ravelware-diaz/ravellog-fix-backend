const { kanban_tag } = require('../models')

class KanbanTagController {
    static insert(data, t) {
        console.log(data, 'DATA SIAP KANBAN')
        data = data.map(el => {
            return {
                epc_tag_id: el.id,
                date_in: new Date().toISOString()
            }
        })
        return kanban_tag.bulkCreate(data, { transaction: t })
    }
}

module.exports = KanbanTagController