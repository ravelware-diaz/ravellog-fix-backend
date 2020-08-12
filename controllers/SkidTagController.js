const { skid_tag, kanban_tag, epc_tag, sequelize } = require('../models')
const { loggerError } = require('../helpers/Winston')

class SkidTagController {
    static insert(data, t) {
        let preparedData = {
            epc_tag_id: data.id,
            date_in: new Date().toISOString()
        }
        return skid_tag.create(preparedData, { transaction: t })
    }

    static querySkid(req, res, next) {
        sequelize.query(`SELECT et.name, st.id AS "skid_tag_id", SUM(et.quantity) AS "total", COUNT(kt.id) AS "kanban_count"
        FROM ravellog_fix_backend.dbo.skid_tags st
        JOIN ravellog_fix_backend.dbo.kanban_tags kt
        ON st.id = kt.skid_tag_id 
        JOIN ravellog_fix_backend.dbo.epc_tags et
        ON et.id = kt.epc_tag_id
        GROUP BY et.name, st.id;`)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            loggerError.error(`Some internal server error in querySKid function occured with message: ${JSON.stringify(err)}`)
            return next(err)
        })
    }
}

module.exports = SkidTagController