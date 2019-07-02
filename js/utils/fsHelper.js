/*
 * File: /Users/origami/Desktop/timvel-server/js/utils/fsHelper.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Wednesday May 29th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Wednesday May 29th 2019 10:03:52 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
const fs = require('fs');
const path = require('path');
const createFile = filename => {
  if (fs.existsSync(filename)) fs.unlinkSync(filename);
  fs.writeFileSync(filename);
};
const write = (path, content) => {
  fs.writeFileSync(path, content);
};
const append = (path, content) => {
  fs.appendFileSync(path, content);
};
const getExtensionName = path.extname;
const getFilename = path.basename;
const getFilenameWithoutExt = _path =>
  getFilename(_path).replace(getExtensionName(_path), '');
const readDir = fs.readdirSync;

const rename = (_path, newName, keepFile = false) => {
  fs.renameSync(_path, _path.replace(getFilenameWithoutExt(_path), newName));
  // if (!keepFile) fs.unlinkSync(_path);
};
const EXCLUDED = ['.DS_Store'];
const filterFiles = filenames => filenames.filter(o => !EXCLUDED.includes(o));
const exists = fs.existsSync;
const readFile = path => fs.readFileSync(path, { encoding: 'utf8' });
const resolve = path.resolve;
export {
  exists,
  getExtensionName,
  getFilename,
  getFilenameWithoutExt,
  readDir,
  rename,
  filterFiles,
  createFile,
  write,
  append,
  readFile,
  resolve,
};
