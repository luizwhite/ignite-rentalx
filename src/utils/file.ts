import fs from 'fs';
import path from 'path';

export const deleteFile = async (filename: string): Promise<void> => {
  try {
    await fs.promises.stat(filename);
  } catch (err) {
    return;
  }

  await fs.promises.unlink(filename);
};

export const ensureDirectoryExistence = (filePath: string): void => {
  const dirName = path.dirname(filePath);

  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });
};
