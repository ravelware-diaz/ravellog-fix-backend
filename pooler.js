// const fs = require('fs');

// class Pooler {
//     constructor(req, res, next, data) {
//         this.req = req
//         this.res = res
//         this.next = next
//         this.epcBaseData = data
//     }

    // pool(req) {
    //     console.log(req)
    //     if (req.data === "complete") {
    //         this.completePool();
    //     } else {
    //         fs.appendFileSync('./pool_temp.txt', req.data.join('\n'))
    //         this.res.status(200).json({
    //             message: "data pooled"
    //         })
    //     }
    // }
//     completePool() {
        // //get data from temporary file pool
        // let data = fs.readFileSync('./pool_temp.txt', 'utf-8').join('\n')
        // //filter unique data
        // const uniqueData = [...new Set(data)]
        // //filter validated data
        // const validatedData = this.validation(uniqueData)
        // console.log(validatedData)
        // fs.writeFileSync('./pool_temp.txt', '')
//     }
//     validation(data) {
//         let validData = []
        // data.forEach(el => {
        //     let result = this.epcBaseData.filter(data => {
        //         return data.epc_id  === el
        //     })

        //     result ? validData.push(result) : null 
        // })
        // return validData
//     }
    
// }

// module.exports = Pooler
