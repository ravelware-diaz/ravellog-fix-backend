const { epc_tag, skid_tag, kanban_tag } = require('../models')

class EpcTagController {
    static updateCycle(data, t) {
        data = data.map(el  => {
            if (el.id) {
                return el.id
            } else {
                return el.epc_tag_id
            }
        })
        return epc_tag.increment({ cycle: +1 }, { where: { id: data } }, { transaction: t })
    }

    static queryEpc(req, res, next) {
        epc_tag.findAll({
            include: {
                all: true,
                nested: true
            }
        })
        .then(result => {
            console.log(result)
            return res.status(200).json(result)
        })
        .catch(err => {
            return next(err)
        })
    }
}

module.exports = EpcTagController