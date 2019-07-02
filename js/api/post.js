/*
 * File: /Users/origami/Desktop/timvel-server/js/api/post.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday March 16th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Wednesday May 15th 2019 8:56:34 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import { Router } from 'express';
import Moment from 'moment';
import db from '../config/db';
import { toCamelObject, HANDLER } from '../utils';
import { from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/internal/operators';
import { Notification, Posts } from '../DAOs';
const nextInterval = interval => {
  switch (interval) {
    case 7:
      return 30;
    case 30:
      return 365;
    case 365:
      return 1825;
    case 1825:
      return 3650;
    default:
      return 7;
  }
};
const router = Router();
router.get('/all', async (req, res) => {
  try {
    const { offset = 0 } = req.query;
    const [rows] = await db.sequelize.query(
      `
      select
      *
      from api.posts
      where content != ''
      order by created_at desc
      limit 50
      offset ?
      `,
      {
        replacements: [offset],
      },
    );
    res.status(200).json(rows.map(toCamelObject));
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.get('/more', async (req, res) => {
  try {
    const { post_ids = [0], happened_at } = req.query;
    let interval = 5;
    const data = await Posts.fetchPostsByIntervalRecursive(
      happened_at,
      interval,
      post_ids.length === 0 ? [0] : post_ids,
      0,
    );
    res.status(200).json(data.map(toCamelObject));
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.post('/', async (req, res) => {
  try {
    const {
      content,
      image_urls,
      user_id,
      weather_info,
      post_type,
      tag_id,
      happened_at,
      precision = 'day',
    } = req.body;
    const formatedDate = Moment(happened_at);
    const [rows] = await db.sequelize.query(
      `
          insert into timvel_db.posts(content,image_urls,user_id,weather_info,post_type,tag_id,happened_at,year,month,day,precision)
          values(:content,:image_urls,:user_id,:weather_info,:post_type,:tag_id,:happened_at,:year,:month,:day,:precision)
          returning posts.id
          `,
      {
        replacements: {
          content,
          image_urls: JSON.stringify(image_urls),
          user_id,
          weather_info: JSON.stringify(weather_info),
          post_type,
          tag_id,
          happened_at: formatedDate.format(),
          year: formatedDate.format('YYYY'),
          month: formatedDate.format('MM'),
          day: formatedDate.format('DD'),
          precision,
        },
      },
    );
    res.status(200).send({ postId: rows[0].id });
    const post_id = rows[0].id;
    const image_type = 'post';
    try {
      let sqls = [];
      image_urls.forEach(item => {
        sqls.push(
          `('${user_id}','${item.imageUrl}',${post_id},'${image_type}')`,
        );
      });
      sqls = sqls.join(',');
      await db.sequelize.query(
        `
      insert into timvel_db.user_images(user_id,url,post_id,image_type)
      values
      ${sqls}
      `,
      );
    } catch (error) {
      console.warn('add image error', error);
    }
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.get('/', async (req, res) => {
  try {
    const { offset, happened_at } = req.query;
    const [rows] = await db.sequelize.query(
      `
      select
      *
      from api.posts
      where content != ''
      order by created_at desc
      limit 100
      `
    );
    res.status(200).json(rows.map(toCamelObject));
    // const _happened_at = happened_at || Moment().format();
    // Posts.$fetchPostsByPrecision(_happened_at, 'day')
    //   .pipe(
    //     switchMap(data =>
    //       data.length > 0
    //         ? of(data)
    //         : Posts.$fetchPostsByPrecision(_happened_at, 'month'),
    //     ),
    //     switchMap(data =>
    //       data.length > 0
    //         ? of(data)
    //         : Posts.$fetchPostsByPrecision(_happened_at, 'year'),
    //     ),
    //     switchMap(data =>
    //       data.length > 0
    //         ? of(data)
    //         : Posts.fetchPostsByIntervalRecursive(_happened_at, 5, [0], 0),
    //     ),
    //     map(data => data.map(toCamelObject)),
    //   )
    //   .subscribe({
    //     next: data => res.status(200).json(data),
    //     error: error => {
    //       console.warn(error);
    //       res.status(500).send();
    //     },
    //   });
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { limit } = req.query;
    let _limit = 100;
    if (limit) {
      _limit = limit;
    }
    const [rows] = await db.sequelize.query(
      `
        select
        *
        from api.posts
        order by popularity desc
        limit ?
        `,
      {
        replacements: [_limit],
      },
    );
    const data = rows.map(toCamelObject);
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.get('/condition', async (req, res) => {
  try {
    const { user_id, tag_id } = req.query;
    if (typeof user_id !== 'undefined') {
      const [rows] = await db.sequelize.query(
        `
          select
          *
          from api.posts
          where user_id = ?
          order by happened_at desc
          `,
        {
          replacements: [user_id],
        },
      );
      const data = rows.map(toCamelObject);
      res.status(200).json(data);
      return;
    }

    if (typeof tag_id !== 'undefined') {
      const [rows] = await db.sequelize.query(
        `
          select
          *
          from api.posts
          where tag_id = ?
          order by happened_at desc
          `,
        {
          replacements: [tag_id],
        },
      );
      const data = rows.map(toCamelObject);
      res.status(200).json(data);
      return;
    }

    res.status(404).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.post('/emoji', async (req, res) => {
  try {
    const { post_id, emoji, user_id } = req.body;
    const allEmojis = ['shock', 'angry', 'nofeeling', 'vomit', 'laugh'];
    if (!allEmojis.includes(emoji)) {
      res.status(404).send();
      return;
    }

    await db.sequelize.query(
      `
          insert into timvel_db.post_emojis(post_id,${emoji})
          values(?,1)
          on conflict(post_id)
          do
          update 
          set ${emoji} = post_emojis.${emoji} + 1
          `,
      {
        replacements: [post_id],
      },
    );
    res.status(200).send();
    from(
      db.sequelize.query(
        `
        insert into timvel_db.emoji_history(user_id,post_id,emoji)
        values(?,?,?)
        `,
        {
          replacements: [user_id, post_id, emoji],
        },
      ),
    ).subscribe({
      next: () => {
        console.warn('emoji history', post_id, user_id);
      },
      error: err => {
        console.warn('emoji history error', err);
      },
    });
  } catch (error) {
    res.status(500).send();
    console.warn(error);
  }
});

router.get('/comments', async (req, res) => {
  try {
    const { post_id, offset } = req.query;
    let offsetNum = offset || 0;
    const [rows] = await db.sequelize.query(
      `
        select
        *
        from api.post_comments
        where post_id = ?
        order by created_at asc
        offset ?
        limit 100
        `,
      {
        replacements: [post_id, offsetNum],
      },
    );
    const data = rows.map(toCamelObject);
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
  }
});

router.post('/comments', async (req, res) => {
  try {
    const {
      post_id,
      user_id,
      content,
      associated_comment_id = null,
      receiver_user_id,
    } = req.body;
    const [rows] = await db.sequelize.query(
      `
        insert into timvel_db.post_comments(post_id,user_id,content,associated_comment_id)
        values(?,?,?,?)
        returning id
        `,
      {
        replacements: [post_id, user_id, content, associated_comment_id],
      },
    );
    res.status(200).json({
      commentId: rows[0].id,
    });
    if (user_id == receiver_user_id) {
      return;
    }
    Notification.insertNotifation({
      type: 'comment',
      sender_user_id: user_id,
      comment_id: rows[0].id,
      receiver_user_id,
      post_id,
      associated_comment_id,
    }).subscribe(HANDLER());
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
export default router;
