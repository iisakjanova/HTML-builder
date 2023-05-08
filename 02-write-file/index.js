const path = require('path');
const readline = require('readline');
const fs = require('fs');

console.log ('Hello!');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = path.join(__dirname, 'text.txt');
const fileStream = fs.createWriteStream(filePath);

rl.setPrompt('Enter text to write to file: ');
rl.prompt();

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    fileStream.write(input + '\n');
    console.log(`Text saved: ${input}`);
    rl.prompt();
  }
});

rl.on('close', () => {
  fileStream.end();
});
