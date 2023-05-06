const fs = require('fs');
const path = require('path');

const mergeStyles = async () => {
  const sourceFolderPath = path.join(__dirname, 'styles');
  const destinationFilePath = path.join(__dirname, 'project-dist/bundle.css');

  const fileExists = async () => {
    try {
      await fs.promises.stat(destinationFilePath);
      return true; // file exists
    } catch (err) {

      if (err.code === 'ENOENT') {
        return false; // file does not exist
      } 
    }
  };

  if (await fileExists()) {
    await fs.promises.unlink(destinationFilePath);
  }

  const files = await fs.promises.readdir(sourceFolderPath, { withFileTypes: true });
  const writeStream = fs.createWriteStream(destinationFilePath, { flags: 'a' });
  let readStream;
  
  for (const file of files) {
    if (path.extname(file.name) === '.css' && file.isFile()) {
      const sourceFilePath = path.join(sourceFolderPath, file.name);
      readStream = fs.createReadStream(sourceFilePath, 'utf8');
      
      let data = '';

      readStream.on('data', (chunk) => {
        data += chunk;
        writeStream.write(data + '\n');
      });
    }
  }

  readStream.on('end', () => {
    writeStream.end();
  });
};

try {
  mergeStyles();
} catch (err) {
  console.error(err);
}
