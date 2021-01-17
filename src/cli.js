import * as Readline from "readline";

let cli;

function open() {
  // Initialize console read/write
  cli = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

export function ask(question) {
  return new Promise((resolve, reject) => {
    open();
    cli.question(question, answer => {
      resolve(answer);
      cli.close();
    });
  });
}
