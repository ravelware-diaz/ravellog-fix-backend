const { skid_kanban_combine } = require('../models')
const batch = require('../models/batch')

class SkidKanbanCombineController {
    static insert(data, t) {
        let preparedData = []
        data.kanban.forEach(kanban => {
            data.skid.forEach(skid => {
                preparedData.push({
                    skid_tag_id: skid.id,
                    kanban_tag_id: kanban.id,
                    batch_id: data.batch.id
                })
            })
        })
        console.log(preparedData, 'INI DATA BUAT COMBINE')
        return skid_kanban_combine.bulkCreate(preparedData, { transaction: t })
    }
}

module.exports = SkidKanbanCombineController