/*
 * File: /Users/origami/Desktop/timvel-server/js/api/postTag.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday March 16th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Saturday March 23rd 2019 2:42:17 pm
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import { Router } from 'express';
import db from '../config/db';
import { toCamelObject } from '../utils';
import {} from 'rxjs';
import {} from 'rxjs/operators';
const router = Router();

router.get('/user_tag', async (req, res) => {
  try {
    const { user_id } = req.query;
    const [rows] = await db.sequelize.query(
      `
      select
      posts.tag_id,
      post_tags.tag,
      post_tags.popularity
      from timvel_db.posts
      left join api.post_tags
      on posts.tag_id = post_tags.tag_id
      where user_id = ?
      group by posts.tag_id,post_tags.tag,post_tags.popularity
      limit 50
      `,
      {
        replacements: [user_id],
      },
    );
    if (rows.length > 0) {
      res.status(200).json(rows.map(toCamelObject));
      return;
    }
    const [row] = await db.sequelize.query(
      `
        select 
        *
        from api.post_tags
        order by popularity desc
        limit 20
        `,
    );
    res.status(200).json(row.map(toCamelObject));
  } catch (error) {
    console.warn(error);
  }
});
router.post('/', async (req, res) => {
  try {
    const { tag } = req.body;
    const [rows] = await db.sequelize.query(
      `
        select
        *
        from api.post_tags
        where tag = ?
        `,
      {
        replacements: [tag],
      },
    );
    if (rows.length > 0) {
      res.status(200).send(toCamelObject(rows[0]));
      return;
    }
    const [row] = await db.sequelize.query(
      `
        insert into timvel_db.post_tags(tag)
        values (?)
        returning id
        `,
      {
        replacements: [tag],
      },
    );
    res.status(201).send({
      tagId: row[0].id,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.get('/popular', async (req, res) => {
  try {
    const [rows] = await db.sequelize.query(
      `
        select 
        *
        from api.post_tags
        order by popularity desc
        limit 100
        `,
    );
    res.status(200).json(rows.map(toCamelObject));
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    const [rows] = await db.sequelize.query(
      `
        select 
        *
        from api.post_tags
        where tag ilike ?
        order by popularity desc
        `,
      {
        replacements: [`%${tag}%`],
      },
    );
    res.status(200).json(rows.map(toCamelObject));
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
export default router;
