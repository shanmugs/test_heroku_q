const  queueMgr = require("./queueMgr.js")
const _queue = "task1_q";

// const mseg= {
//     "name":"sathish"
// }


// pushMessage(_queue,JSON.stringify(mseg), null).then((data) => {
//     console.log(data)
// }).catch ((error)=>{
//     console.log(error)
// })

queueMgr.receiveAndProcessMessage(_queue, null).then((data) => {
    console.log(data)
}).catch((error) => {
    console.log(error)
})