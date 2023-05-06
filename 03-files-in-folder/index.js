const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

const listFiles = async () => {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  
  for (const file of files) {

    if (file.isFile()) {
      const fileName = file.name;
      const { name } = path.parse(fileName);
      const extension = path.extname(file.name).slice(1);
      const filePath = `${folderPath}/${fileName}`;

      try {
        const stats = await fs.stat(filePath);
        const size = `${stats.size} bytes`;

        console.log(`${name} - ${extension} - ${size}`);
      } catch (err) {
        console.error(err);
      }
    }
  }
};

try {
  listFiles();
} catch (err) {
  console.error(err);
}
