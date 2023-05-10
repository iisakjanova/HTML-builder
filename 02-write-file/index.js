const path = require('path');
const fs = require('fs');

console.log('Hello!');

const filePath = path.join(__dirname, 'text.txt');
const fileStream = fs.createWriteStream(filePath);

process.stdin.setEncoding('utf8');
process.stdin.resume();

console.log('Enter text to write to file: ');

process.stdin.on('data', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    process.exit();
  } else {
    fileStream.write(input);
    console.log(`Text saved: ${input.trim()}`);
  }
});

process.on('SIGINT', () => {
  console.log('\nGood Bye!');
  fileStream.end();
  process.exit();
  });
