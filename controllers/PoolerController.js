const fs = require('fs')
const { epc_tag, sequelize } = require('../models')
const KanbanTagController = require('./KanbanTagController')
const SkidTagController = require('./SkidTagController')
const EpcTagController = require('./EpcTagController')
const { loggerError, loggerInfo } = require('../helpers/Winston')

class PoolerController {
    //validate data based on active status
    static validate(toBeValidatedData) {
        loggerInfo.info(`Begin validation, processed data: ${toBeValidatedData}`)

        return new Promise((resolve, rejects) => {
            if (toBeValidatedData === "complete") {
                loggerInfo.info(`Data input evaluated as trigger and begin to process for insertion, processed data: ${toBeValidatedData}`)
                return resolve(toBeValidatedData)
            } else {                
                epc_tag.findAll({
                    attributes: ["id", "epc_id", "category"],
                    where: {
                        status: "active"
                    }
                })
                .then(data => {
                    loggerInfo.info(`Reference data for comparison, processed data: ${JSON.stringify(data)}`)
    
                    let validData = []
                    toBeValidatedData.forEach(el => {
                        let result = data.filter(element => {
                            return element.dataValues.epc_id  === el
                        })
                        result[0] ? validData.push(result[0].dataValues) : null
                    })
                    loggerInfo.info(`Validated data ready, processed data: ${JSON.stringify(validData)}`)
    
                    return resolve(validData)
                })
                .catch(err => {
                    return rejects(err)
                })
            }
        })
               
    }
    //pooling data to temporary file
    static pool(req, res, next) {
        loggerInfo.info(`Initial process, processed data: ${req.body.data}`, )
        if (req.body.data[0]) {
            loggerInfo.info(`Data evaluated as not null, processed data: ${req.body.data}`)
            PoolerController.validate(req.body.data)
            .then(result => {
                if (result === "complete") {
                    PoolerController.completePool()
                    .then(result => {
                        return res.status(200).json(result)
                    })
                    .catch(err => {
                        return next(err)
                    })
                } else {
                    loggerInfo.info(`Pooled data and write to temp file, processed data: ${JSON.stringify(result)}`)
                    console.log(result)
                    if (result[0]) {
                        fs.appendFileSync('./pool_temp.txt', JSON.stringify(result) + '\n')
                        return res.status(200).json({
                            message: "data pooled"
                        }) 
                    } else {
                        loggerError.error(`Error there is not data valid to be pooled`)
                        return next({
                            name: 'BadRequest',
                            errors: [{ message: 'There is no valid data!' }]
                        })
                    }
                }
            })
            .catch(() => {
                loggerError.error(`Some internal server in validation function error occured with message: ${JSON.stringify(err)}`)
                return next({
                    name: 'InternalServer',
                    errors: [{ message: 'Internal server occured!' }]
                })
            })
        } else {
            loggerInfo.info(`Data evaluated as null, processed data: ${req.body.data}`)
            loggerError.error(`Error data must be not null, processed data: ${req.body.data}`)
            return next({
                name: 'NotFound',
                errors: [{ message: 'Unknown EPC detected!' }]
            })
        }
               
    }
    //classify data based on category
    static classify(data) {
        let classified = {
            skid: [],
            kanban: []
        }
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
            loggerInfo.info(`Begin transaction, processed data: ${JSON.stringify(data)}`)
            const t = await sequelize.transaction();
            try {
                //data preparation ensure all data comply the insertion constraint
                let preparedData = {
                    kanban: [],
                    skid: data.skid[0],
                    all: [ ...data.kanban, ...data.skid ]
                }
                loggerInfo.info(`Data has been prepared and proceed to skidTag model insertion, processed data: ${JSON.stringify(preparedData.skid)}`)
                const resultSkidOpt = await SkidTagController.insert(preparedData.skid, t)
                preparedData.kanban = data.kanban.map(el => {
                    el.skid_tag_id = resultSkidOpt.dataValues.id
                    el.epc_tag_id = el.id
                    el.date_in = new Date().toISOString()
                    delete el.id
                    return el
                })
                loggerInfo.info(`Data has been prepared and proceed to kanbanTag model insertion, processed data: ${JSON.stringify(preparedData.kanban)}`)
                const resultKanbanOpt = await KanbanTagController.insert(preparedData.kanban, t)
                loggerInfo.info(`Data has been prepared and proceed to epcTag model update cycle, processed data: ${JSON.stringify(preparedData.all)}`)
                const resultEpcOpt = await EpcTagController.updateCycle(preparedData.all, t)
                fs.writeFileSync('./pool_temp.txt', '')
                loggerInfo.info(`Clean up temp file for next pool, processed data: `)
                loggerInfo.info(`Transaction Success`)
                await t.commit()

                return resolve({
                    message: "Data has been recorded"
                })
            } catch (err) {
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

            if (data[0]) {
                loggerInfo.info(`Read pooled data from temp file, processed data: ${JSON.stringify(data)}`)
                data.forEach(el => {
                    JSON.parse(el).forEach(elData => {
                        cleanData.push(elData)
                    })
                })
                loggerInfo.info(`Cleaning data pooled in temp file, processed data: ${JSON.stringify(cleanData)}`)
    
                //filter unique data
                const uniqueData = PoolerController.findUnique(cleanData)
                loggerInfo.info(`Filter data to get only unique, processed data: ${JSON.stringify(uniqueData)}`)
    
                //classify data
                const classifiedData = PoolerController.classify(uniqueData)
                loggerInfo.info(`Classify data and separate between skid and kanban, processed data: ${JSON.stringify(classifiedData)}`)
    
                //insert data
                loggerInfo.info(`Insertion function begin, processed data: ${JSON.stringify(classifiedData)}`)
                PoolerController.insertData(classifiedData)
                .then((result) => {
                    return resolve(result)
                })
                .catch(err => {
                    loggerError.error(`Some internal server error in insertion function occured with message: ${JSON.stringify(err)}`)
                    return rejects(err)
                })
            } else {
                loggerError.error(`Some internal server error in insertion function occured with message: No data in temporary file`)
                return rejects({
                    name: 'InternalServer',
                    errors: [{ message: 'No data in pooling temp file!' }]
                })
            }
        })
        
    }
    //driver function this is the initial point of process
    static processData(req, res, next) {
        PoolerController.pool(req, res, next)
    }
}

module.exports = PoolerController;