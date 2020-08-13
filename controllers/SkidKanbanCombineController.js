const { skid_kanban_combine } = require('../models')
const batch = require('../models/batch')

class SkidKanbanCombineController {
    static insert(data, t) {
        let preparedData = []
        if (data.skid) {
            data.skid.forEach(el => {
                data.tag.forEach(tag => {
                    preparedData.push({
                        epc_tag_id: tag.id,
                        batch_id: data.batch.id,
                        placement_tag_id: el.id
                    })
                })
            })
        } else {
            preparedData = data.tag.map(el => {
                return {
                    epc_tag_id: el.id,
                    batch_id: data.batch.id
                }
            })
        }
        console.log(preparedData, 'INI DATA BUAT COMBINE')
        return skid_kanban_combine.bulkCreate(preparedData, { transaction: t })
    }
}

module.exports = SkidKanbanCombineController