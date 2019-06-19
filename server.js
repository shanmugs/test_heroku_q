'use strict';

const Hapi = require('@hapi/hapi');
const  queueMgr = require("./queueMgr.js")


const _queue = "task1_q";

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {

            return 'Get is working ! Now test the Post !';
        }
    });

    server.route({
        method: 'POST',
        path: '/push',
        handler: async function (request, h) {
    
            const payload = request.payload;
            console.log(payload)
            if(payload){
                try {
                    const data =   await queueMgr.pushMessage(_queue, JSON.stringify(payload), null);
                      if(data){
                          console.log(data)
                          return "The response is  "+JSON.stringify(data);
                      }else {
                          console.log("No response from QueueMgr!!")
                      }
      
                  } catch (error) {
                      console.log(error);
                      return " Error!!  "+ error;
                  }
            }else {
                console.log("no message payload to push !!")
            }
          
        }
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();