/*
 * File: /Users/origami/Desktop/timvel-server/js/api/report.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday May 4th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Sunday May 5th 2019 8:08:12 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import db from '../config/db';
import { Router } from 'express';
const router = Router();
//api/v1/report

router.post('/', async (req, res) => {
  try {
    const { child_id, type, reason, user_id = null } = req.body;
    await db.sequelize.query(
      `
            insert into timvel_db.reports(child_id,user_id,type,reason)
            values(?,?,?,?)
            `,
      {
        replacements: [child_id, user_id, type, reason],
      },
    );
    res.status(200).send();
  } catch (err) {
    console.warn(err);
    res.status(500).send();
  }
});

export default router;
