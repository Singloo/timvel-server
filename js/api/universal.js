/*
 * File: /Users/origami/Desktop/timvel-server/js/api/universal.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday April 27th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Saturday April 27th 2019 6:44:24 pm
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import { Router } from 'express';
const router = Router();

router.get('/check_new_version', (req, res) => {
  const { app, platform } = req.headers;
  const build = req.headers['build-number'];
  const version = req.headers['readable-version'];
  res.status(200).send({
    message: 'asdas',
    link: 'http://timvel.com',
    hasNew: false,
  });
});
export default router;
