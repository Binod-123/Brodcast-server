const { Command } = require("commander");
const WebSocket = require('ws');

const program = new Command();

program.command('start').description('Start the brodcast server')
.option('-p,--port <number>', 'Port to run the server on',8080).action((option)=>{
    const port =option.port;
    const wss= new WebSocket.Server({port});
    const clients = new Set();

    wss.on('connection', (ws)=>{
        console.log('new client connected.');
        clients.add(ws);

        ws.on('message',(message)=>{
            console.log(`Recived:${message}`);

            clients.forEach((client)=>{
                if(client.readyState===WebSocket.OPEN){
                     client.send(message);
                }
            });
        });
        ws.on('close',()=>{
            console.log('Client disconnected.');
            client.delete(ws);
        });
        ws.on('error',(error)=>{
            console.log(`client error:${error}`);
            client.delete(ws);
        });
    });
    wss.on('listening',()=>{
        console.log('Broadcast server is running on ws://localhost:${port}');
    });
    wss.on('error',(error)=>{
        console.error(`Server error:${error}`);
    });
});
program.parse(process.argv);