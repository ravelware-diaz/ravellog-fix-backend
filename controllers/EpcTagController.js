const { epc_tag } = require('../models')

class EpcTagController {
    static updateCycle(data, t) {
        data = data.map(el  => {
            if (el.id) {
                return el.id
            } else {
                return el.epc_tag_id
            }
        })
        console.log(data)
        return epc_tag.update({ cycle: +1 },{
            where: {
                id: data
            }
        }, { transaction: t })
    }
}

module.exports = EpcTagController