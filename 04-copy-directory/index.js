const fs = require('fs/promises');
const path = require('path');

const currentFolderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  const dir = async () => {

    try {
      await fs.stat(path);
      return true; // folder exists
    } catch (err) {

      if (err.code === 'ENOENT') {
        return false; // folder does not exist
      } 
    }
  };

  if (dir) {
    await fs.rm(newFolderPath, { recursive: true, force: true });
  }

  await fs.mkdir(newFolderPath, { recursive: true });

  const files = await fs.readdir(currentFolderPath, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(currentFolderPath, file.name);
    const destinationPath = path.join(newFolderPath, file.name);
    await fs.copyFile(sourcePath, destinationPath);
  }
};

try {
  copyDir();
} catch (err) {
  console.error(err);
}
