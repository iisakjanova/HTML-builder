const fs = require('fs');

const readStream = fs.createReadStream('./01-read-file/text.txt', 'utf8');

let data = '';

readStream.on('data', (chunk) => {
  data += chunk;
});

readStream.on('end', () => {
  console.log(data);
});

readStream.on('error', (err) => {
  console.log(err.message);
});
