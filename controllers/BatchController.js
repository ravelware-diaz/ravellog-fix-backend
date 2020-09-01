const { batch } = require('../models')

class BatchController {
    static insert(t) {
        return batch.create({ date_in: new Date().toISOString() },{ transaction: t })
    }
}

module.exports = BatchController