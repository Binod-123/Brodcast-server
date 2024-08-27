// client.js

const { Command } = require("commander");
const WebSocket = require("ws");
const readline = require("readline");

const program = new Command();

program
  .command("connect")
  .description("Connect to the broadcast server as a client")
  .option("-u, --url <string>", "WebSocket server URL", "ws://localhost:8080")
  .action((options) => {
    const ws = new WebSocket(options.url);

    ws.on("open", () => {
      console.log(`Connected to server at ${options.url}`);
      promptInput();
    });

    ws.on("message", (message) => {
      console.log(`\nBroadcasted Message: ${message}`);
      promptInput();
    });

    ws.on("close", () => {
      console.log("Disconnected from server.");
      process.exit(0);
    });

    ws.on("error", (error) => {
      console.error(`Connection error: ${error.message}`);
      process.exit(1);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function promptInput() {
      rl.question(
        'Enter message to broadcast (or type "exit" to quit): ',
        (input) => {
          if (input.toLowerCase() === "exit") {
            ws.close();
            rl.close();
          } else {
            ws.send(input);
          }
        }
      );
    }
  });

program.parse(process.argv);
