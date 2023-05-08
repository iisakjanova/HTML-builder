const fs = require('fs');
const path = require('path');

const destinationFolderPath = path.join(__dirname, 'project-dist');
const sourceAssetsFolderPath = path.join(__dirname, 'assets');
const destinationAssetsFolderPath = path.join(destinationFolderPath, 'assets');

const createStyles = async () => {
  const sourceFolderPath = path.join(__dirname, 'styles');
  const destinationFilePath = path.join(destinationFolderPath, 'style.css');
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
        writeStream.write(data);
      });
    }
  }

  readStream.on('end', () => {
    writeStream.end();
  });
};

const copyAssets = async (sourceFolderPath, destinationFolderPath) => {
  await fs.promises.mkdir(destinationFolderPath, { recursive: true });

  const files = await fs.promises.readdir(sourceFolderPath, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(sourceFolderPath, file.name);
    const destinationPath = path.join(destinationFolderPath, file.name);

    if (file.isDirectory()) {
      await copyAssets(sourcePath, destinationPath); // recursively copy subdirectories
    } else {
      await fs.promises.copyFile(sourcePath, destinationPath);
    }
  }
};

const buildPage = async () => {
  const templateFilePath = path.join(__dirname, 'template.html');
  const componentsFolderPath = path.join(__dirname, 'components');
  
  const indexFilePath = path.join(destinationFolderPath, 'index.html');

  const folderExists = async () => {

    try {
      await fs.promises.stat(destinationFolderPath);
      return true; // folder exists
    } catch (err) {

      if (err.code === 'ENOENT') {
        return false; // folder does not exist
      } 
    }
  };

  if (await folderExists()) {
    await fs.promises.rm(destinationFolderPath, { recursive: true, force: true });
  }

  await fs.promises.mkdir(destinationFolderPath);
  const writeStream = fs.createWriteStream(indexFilePath);

  const files = await fs.promises.readdir(componentsFolderPath, { withFileTypes: true });

  const components = await files.reduce(async (acc, file) => {
    const fileName = file.name;
    const { name } = path.parse(fileName);
    const componentsFilePath = path.join(componentsFolderPath, file.name);
    const readStream = fs.createReadStream(componentsFilePath, 'utf8');
  
    let data = '';
  
    readStream.on('data', (chunk) => {
      data += chunk;
    });
  
    await new Promise((resolve, reject) => {
      readStream.on('end', () => {
        resolve();
      });
  
      readStream.on('error', (err) => {
        reject(err);
      });
    });
  
    const obj = await acc;
    obj[name] = data;
    return obj;
  }, Promise.resolve({}));
  
  const readStreamTemplateFile = fs.createReadStream(templateFilePath, 'utf8');

  let templateData = '';

  readStreamTemplateFile.on('data', (chunk) => {
    templateData += chunk;
  });

  readStreamTemplateFile.on('end', () => {
    const regex = /{{(.*?)}}/g;
    const replacedData = templateData.replace(regex, (match, word) => {
      const key = word.trim();
      return components[key] || match;
    });

    writeStream.write(replacedData + '\n');
  });

  readStreamTemplateFile.on('error', (err) => {
    console.log(err.message);
  });

  await createStyles();
  await copyAssets(sourceAssetsFolderPath, destinationAssetsFolderPath);
};


try {
  buildPage();
} catch (err) {
  console.log(err);
}
