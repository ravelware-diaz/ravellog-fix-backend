const { epc_tag } = require('../models')
const fs = require('fs')
const { sequelize } = require('../models')
const KanbanTagController = require('./KanbanTagController')
const SkidTagController = require('./SkidTagController')
const EpcTagController = require('./EpcTagController')

class PoolerController {
    //validate data based on active status
    static validate(toBeValidatedData) {
        return new Promise((resolve, rejects) => {
            epc_tag.findAll({
                attributes: ["id", "epc_id", "category"],
                where: {
                    status: "active"
                }
            })
            .then(data => {
                let validData = {
                    nonTrigger: [],
                    trigger: []
                }
                toBeValidatedData.forEach(el => {
                    let result = data.filter(element => {
                        return element.dataValues.epc_id  === el
                    })
                    if (result[0]) {
                        if (result[0].dataValues.category === 'trigger') {
                            validData.trigger.push(result[0].dataValues)
                        } else {
                            validData.nonTrigger.push(result[0].dataValues)
                        }
                    }
                })
                return resolve(validData)
            })
            .catch(err => {
                return rejects(err)
            })
        })
               
    }
    //pooling data to temporary file
    static pool(req, res, next) {
        if (req.body.data) {
            PoolerController.validate(req.body.data)
            .then(result => {
                if (result.trigger[0]) {
                    console.log('hai')
                    PoolerController.completePool()
                    .then(result => {
                        return res.status(200).json(result)
                    })
                    .catch(err => {
                        return res.status(200).json(err)
                    })
                } else {
                    console.log('wadidaw<<<<<')
                    console.log(JSON.stringify(result.nonTrigger))
                    result.nonTrigger[0] ? fs.appendFileSync('./pool_temp.txt', JSON.stringify(result.nonTrigger) + '\n') : null
                    return res.status(200).json({
                        message: "data pooled"
                    }) 
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
        //jagan lupa kasih next handleerror
               
    }
    //classify data based on category
    static classify(data) {
        let classified = {
            skid: [],
            kanban: []
        }
        console.log(data)
        data.forEach(el => {
            el.category === 'skid' ? classified.skid.push(el) : classified.kanban.push(el)
        })

        return classified
    }
    //filter unique data
    static findUnique(data) {
        let uniqueData = []
        for (let i = 0; i < data.length; i++) {
            if (uniqueData.length < 1) {
                uniqueData.push(data[i])
            } else {
                let flag = false
                for (let j = 0; j < uniqueData.length; j++) {
                    if (data[i].epc_id === uniqueData[j].epc_id) {
                        flag = true
                        break
                    }
                }
                !flag ? uniqueData.push(data[i]) : null
            }
        }
        return uniqueData
    }
    //insert data to database
    static insertData(data) {
        return new Promise(async (resolve, rejects) => {
            const t = await sequelize.transaction();
            try {
                //data preparation ensure all data comply the insertion constraint
                let preparedData = {
                    kanban: [],
                    skid: data.skid[0],
                    all: [ ...data.kanban, ...data.skid ]
                }
                const resultSkidOpt = await SkidTagController.insert(preparedData.skid, t)
                preparedData.kanban = data.kanban.map(el => {
                    el.skid_tag_id = resultSkidOpt.dataValues.id
                    el.epc_tag_id = el.id
                    el.date_in = new Date().toISOString()
                    delete el.id
                    return el
                })
                const resultKanbanOpt = await KanbanTagController.insert(preparedData.kanban, t)
                console.log(resultKanbanOpt, 'INI KANBAN')
                const resultEpcOpt = await EpcTagController.updateCycle(preparedData.all, t)
                fs.writeFileSync('./pool_temp.txt', '')
                await t.commit()
                return resolve({
                    message: "Data has been recorded"
                })
            } catch (err) {
                console.log('INI ERROR')
                await t.rollback()
                return rejects(err)
            }
        })
    }
    //complete pooling and prepare to insert
    static completePool() {
        return new Promise((resolve, rejects) => {
            //get data from temporary file pool
            let cleanData = []
            let data = fs.readFileSync('./pool_temp.txt', 'utf-8').split('\n').filter(Boolean)
            data.forEach(el => {
                JSON.parse(el).forEach(elData => {
                    cleanData.push(elData)
                })
            })
            //filter unique data
            const uniqueData = PoolerController.findUnique(cleanData)
            //classify data
            const classifiedData = PoolerController.classify(uniqueData)
            //insert data
            PoolerController.insertData(classifiedData)
            .then((result) => {
                return resolve(result)
            })
            .catch(err => {
                return rejects(err)
            })
        })
        
    }
    //driver function this is the initial point of algorithm
    static proceedData(req, res, next) {
        PoolerController.pool(req, res, next)
    }

}

module.exports = PoolerController;