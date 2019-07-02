/*
 * File: /Users/origami/Desktop/timvel-server/js/api/user.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday March 16th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Monday May 20th 2019 8:08:37 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import { Router } from 'express';
import db from '../config/db';
import { toCamelObject } from '../utils';
import {} from 'rxjs';
import {} from 'rxjs/operators';
import {} from '../DAOs';
import OSS from 'ali-oss';
import { get } from 'lodash';
import AV from 'leancloud-storage';
const STS = OSS.STS;
const router = Router();
router.get('/show_timer', (req, res) => {
  const { user_id } = req.query;
  res.status(200).send({
    show: true,
  });
});
router.get('/photo', async (req, res) => {
  try {
    const { user_id, unique_id } = req.query;
    const targets = [
      // '5a005c211579a3004584970b',
      '5c8e38418d6d810070ee7dba',
      '5a4c25eed50eee0f347e2875',
    ];
    const next = targets.includes(user_id);
    if (!next) {
      res.status(400).send();
      return;
    }
    const [row] = await db.sequelize.query(
      `
      select
      id,
      edges
      from timvel_db.user_photos
      where user_id = ? and unique_id = ? and task_status = 'waiting'
      `,
      {
        replacements: [user_id, unique_id],
      },
    );
    if (row[0]) {
      res.status(200).json({
        next: true,
        taskId: row[0].id,
        photos: row[0].edges,
      });
      return;
    }

    //if not exists return last cursor
    const [rows] = await db.sequelize.query(
      `
      select
      id,
      page_info->>'end_cursor' as cursor
      from timvel_db.user_photos
      where user_id = ? and unique_id = ? and task_status = 'done'
      order by created_at desc
      `,
      {
        replacements: [user_id, unique_id],
      },
    );
    res.status(200).json({
      next: false,
      cursor: get(rows[0], 'cursor', null),
    });
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.put('/photo', async (req, res) => {
  try {
    const { task_id } = req.body;
    await db.sequelize.query(
      `
       update timvel_db.user_photos
       set 
       task_status = 'done' 
       where id = ?
      `,
      {
        replacements: [task_id],
      },
    );
    res.status(200).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.post('/photo_exception', async (req, res) => {
  try {
    const { user_id, photo, unique_id } = req.body;
    await db.sequelize.query(
      `
      insert into timvel_db.user_photo_exceptions(user_id,unique_id,photo)
      values(?,?,?)
      `,
      {
        replacements: [user_id, unique_id, JSON.stringify(photo)],
      },
    );
    res.status(200).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.post('/photo', async (req, res) => {
  try {
    const { edges, user_id, page_info = {}, unique_id } = req.body;
    const targets = [
      '5a005c211579a3004584970b',
      '5c8e38418d6d810070ee7dba',
      '5a4c25eed50eee0f347e2875',
    ];
    const next = targets.includes(user_id);
    const [row] = await db.sequelize.query(
      `
      select
      *
      from timvel_db.user_photos
      where page_info->>'end_cursor' = ? and user_id = ? and unique_id = ?
      `,
      {
        replacements: [
          page_info ? page_info.end_cursor : null,
          user_id,
          unique_id,
        ],
      },
    );
    if (row[0]) {
      res.status(200).json({ next: row[0].status !== 'done', id: row[0].id });
      return;
    }
    const [re] = await db.sequelize.query(
      `
      insert into timvel_db.user_photos(user_id,edges,page_info,unique_id,task_status)
      values(?,?,?,?,'waiting')
      returning id
      `,
      {
        replacements: [
          user_id,
          JSON.stringify(edges),
          JSON.stringify(page_info),
          unique_id,
        ],
      },
    );
    res.status(200).send({
      next,
      id: re[0].id,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.post('/update', async (req, res) => {
  try {
    let {
      // user_id,
      object_id,
      username,
      user_coin,
      email,
      phone_number,
      organization,
      password,
      detail,
      city,
      country,
      avatar,
    } = req.body;
    const _detail = JSON.stringify(detail);
    // if (user_id === null) {
    const [rows] = await db.sequelize.query(
      `
      insert into timvel_db.user_info
      (object_id,username,user_coin,email,phone_number,organization,password,detail,city,country,avatar)
      values(:object_id,:username,:user_coin,:email,:phone_number,:organization,:password,:detail,:city,:country,:avatar)
      on conflict(object_id)
      do
      update
      set 
      username = coalesce(:username,user_info.username),
      user_coin = coalesce(:user_coin,user_info.user_coin),
      email = coalesce(:email,user_info.email),
      phone_number = coalesce(:phone_number,user_info.phone_number),
      organization = coalesce(:organization,user_info.organization),
      password = coalesce(user_info.password,:password),
      detail = coalesce(:detail,user_info.detail),
      city = coalesce(:city,user_info.city),
      country = coalesce(:country,user_info.country),
      avatar = coalesce(:avatar,user_info.avatar)
      returning id
      `,
      {
        replacements: {
          object_id: object_id,
          username: username,
          user_coin: user_coin,
          email: email,
          phone_number: phone_number || null,
          organization: organization || null,
          password: password || null,
          detail: _detail || null,
          city: city || null,
          country: country || null,
          avatar: avatar || null,
        },
      },
    );
    const data = toCamelObject(rows[0]);
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.post('/image', async (req, res) => {
  try {
    const { url, post_id, user_id, image_type } = req.body;
    await db.sequelize.query(
      `
        insert into timvel_db.user_images(url,post_id,image_type,user_id,video_url)
        values(?,?,?,?)
        `,
      {
        replacements: [url, post_id, image_type, user_id],
      },
    );
    res.status(200).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.get('/authorize', async (req, res) => {
  const { user_id } = req.query;
  try {
    let sts = new STS({
      accessKeyId: process.env.ALIYUNOSS_ACCESS_KEY,
      accessKeySecret: process.env.ALIYUNOSS_SECRET_KEY,
    });
    let policy = {
      Version: '1',
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sts:AssumeRole',
          Resource: 'acs:ram::1183056455163746:role/appreadmodifytimvel',
        },
        {
          Effect: 'Allow',
          Action: ['oss:Get*', 'oss:Put*'],
          Resource: ['acs:oss:*:*:timvel-1', 'acs:oss:*:*:timvel-1/*'],
        },
      ],
    };
    let token = await sts.assumeRole(
      'acs:ram::1183056455163746:role/appreadmodifytimvel',
      policy,
      60 * 60,
      `user${user_id}`,
    );

    let credentials = {
      accessKeyId: token.credentials.AccessKeyId,
      accessKeySecret: token.credentials.AccessKeySecret,
      securityToken: token.credentials.SecurityToken,
    };

    res.status(200).json(credentials);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.get('/:user_id/', async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db.sequelize.query(
      `
        select 
        flowers,
        shits
        from timvel_db.user_gifts
        where user_id = ?
        `,
      {
        replacements: [user_id],
      },
    );
    let giftInfo = {
      flowers: 0,
      shits: 0,
    };
    if (rows.length > 0) {
      Object.assign(giftInfo, rows[0]);
    }
    // const query = new AV.Query('_User')
    // const result = await query.get('user_id');
    const data = {
      ...giftInfo,
      // username: result[0].get('username'),
      // userCoin: result[0].get('userCoin'),
      // avatar: result[0].get('avatar'),
      // objectId: result[0].get('objectId'),
      // sex: result[0].get('sex'),
    };
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.post('/save_installation', async (req, res) => {
  try {
    const { user_object_id, token, platform } = req.body;
    const query = new AV.Query('_Installation');
    if (platform === 'android') {
      query.equalTo('installationId', token);
    } else {
      query.equalTo('deviceToken', token);
    }
    const arrs = await query.find();
    if (arrs[0]) {
      const obj = arrs[0];
      obj.set('userObjectId', user_object_id);
      await obj.save();
      res.status(200).send();
      return;
    }
    res.status(400).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
export default router;
