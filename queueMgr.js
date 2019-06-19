#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
// 'amqp://localhost'  --> localhost
const URL = process.env.CLOUDAMQP_URL || "amqp://xtnkzpjg:PO_AGtxCluGJ0WZ9fnDOd67JEXnhc92o@baboon.rmq.cloudamqp.com/xtnkzpjg";
const isDurable = process.env.TASK_QUEUE_IS_DURABLE || true;
const isPersistent = process.env.TASK_QUEUE_IS_PERSISTENT || true;
 
const pushMessage = (queue, message, options) => {
    return new Promise(function (resolve, reject) {
        try {
            amqp.connect(URL, function (error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
              
                    channel.assertQueue(queue, {
                        durable: isDurable
                    })
                    let msg = JSON.stringify(message)+' : sent to : '+ queue + ' : sent at : ' + new Date().getTime()
                    // consiole.log(msg)
                    channel.sendToQueue(queue, Buffer.from(message), {
                        persistent: isPersistent
                    });

                    console.log(" [x] Sent %s",  message);
                    resolve(" [x] Sent message: "+ message);
                });
                setTimeout(function () {
                    connection.close();
                    //process.exit(0);
                   // amqp.close();
                }, 500);
            });
        } catch (error) {
            console.error(error, `Failed to pushMessage to queue : ` + queue + ' at: ' + new Date().getTime())
            error.logged = true
            //throw error
            reject(error);
        }

    });
}


const receiveAndProcessMessage = (queue, options) => {

    return new Promise(function (resolve, reject) {
        try {
            amqp.connect(URL, function (error, connection) {
                connection.createChannel(function (error, channel) {
                    channel.assertQueue(queue, {
                        durable: isDurable
                    });
                    channel.prefetch(1);
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
                    channel.consume(queue, function (msg) {
                        if (msg && msg.content) {
                            let secs = msg.content.toString().split('.').length - 1;
                            console.log(secs);
                            console.log(" [x] Received %s at %s",  msg.content , ' : received at : ' + new Date().getTime());
                            resolve();
                            setTimeout(function () {
                                console.log(" [x] Done");
                                //resolve(" [x] Done");
                                channel.ack(msg);
                            }, secs * 1000);
                        }

                    }, {
                        noAck: false
                    }); // consume
                }); // channel
            }); // connect 

        } catch (error) {
            console.error(error, `Failed to receiveAndProcessMessage from queue : ` + queue + ' at: ' + new Date().getTime())
            error.logged = true
            //throw error
            reject(error);
        }

    });

}


// const _queue = "task1_q";
// const mseg= {
//     "name":"sathish"
// }


// pushMessage(_queue,JSON.stringify(mseg), null).then((data) => {
//     console.log(data)
// }).catch ((error)=>{
//     console.log(error)
// })

// receiveAndProcessMessage(_queue, null).then((data) => {
//     console.log(data)
// }).catch((error) => {
//     console.log(error)
// })


module.exports = { pushMessage, receiveAndProcessMessage }
 