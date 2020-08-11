const { skid_tag } = require('../models')

class SkidTagController {
    static insert(data, t) {
        let preparedData = {
            epc_tag_id: data.id,
            date_in: new Date().toISOString()
        }
        console.log(preparedData, "INI DATA")
        return skid_tag.create(preparedData, { transaction: t })
    }
}

module.exports = SkidTagController