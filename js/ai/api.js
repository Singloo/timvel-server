/*
 * File: /Users/origami/Desktop/timvel-server/js/ai/api.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Tuesday May 28th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Tuesday July 2nd 2019 10:43:46 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Axios from 'axios';
import { getFilename } from '../utils';
import OSS from 'ali-oss';
const router = Router();
// /ai
const ALI_ENDPOINT = process.env.ALI_OSS_FACE_END_POINT;
const options = {
  accessKeyId: process.env.ALI_ACCESS_KEY_ID_AI,
  accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET_AI,
  bucket: 'timvel-ai',
  region: 'oss-cn-hangzhou',
};
const client = new OSS({
  ...options,
  timeout: 30000,
});
const uploadImage = async localPath => {
  console.log('start uploading ', localPath);
  const start = Date.now();
  const filename = getFilename(localPath);
  await client.put('faces/' + filename, localPath);
  console.log('upload done ', (Date.now() - start) / 1000, localPath);
  return ALI_ENDPOINT + filename;
};
const writeImage = data => {
  const base64Data = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
  const imagePath = path.resolve(__dirname, './images', Date.now() + '.png');
  fs.writeFileSync(imagePath, base64Data, 'base64');
  return imagePath;
};
const homeHtml = fs.readFileSync(
  path.resolve(__dirname, './web/index.html'),
  'utf8',
);
router.use('/static', express.static(path.resolve(__dirname, './web/static')));
router.get('/', (req, res) => res.send(homeHtml));
router.post('/face', async (req, res) => {
  try {
    const { imageData } = req.body;
    const localPath = writeImage(imageData);
    const url = await uploadImage(localPath);
    console.log(url);
    const { data } = await Axios.post(
      `http://${process.env.HK_1_IP}:5000/face/recognize`,
      {
        url,
      },
    );
    const { predictions } = data;
    const result = predictions
      .map(o => 'Feature:' + o[0] + ' Posibility:' + o[1])
      .join(';\n');
    res.status(200).json({
      raw: predictions,
      result,
    });
  } catch (err) {
    console.warn(err);
    res.status(500).send();
  }
});

export default router;
