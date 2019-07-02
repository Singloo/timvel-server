import coordtransform from 'coordtransform';
import _ from 'lodash';
import { toCamelObject } from '../utils';
import { Router } from 'express';
import db from '../config/db';
const router = Router();
const wgs84Togcj02 = (lat, long) => {
  const result = coordtransform.wgs84togcj02(long, lat);
  return {
    lat: result[1],
    long: result[0],
  };
};

const gcj02Towgs84 = (lat, long) => {
  const result = coordtransform.gcj02towgs84(long, lat);
  return {
    lat: result[1],
    long: result[0],
  };
};
router.post('/post_new', async (req, res) => {
  try {
    const { username, avatar, content, latitude, longitude, city } = req.body;
    const { lat, long } = wgs84Togcj02(latitude, longitude);
    await db.sequelize.query(
      `
      insert into timvel_db.wx_user_posts
          (username,avatar,content,city,location)
      values
          (?,?,?,?, ST_GeometryFromText('POINT(? ?)',4326))
      `,
      {
        replacements: [username, avatar, content, city, lat, long],
      },
    );
    res.status(201).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.get('/fetch_posts', async (req, res) => {
  try {
    const { offset, latitude, longitude, range } = req.query;
    let _offset = 0;
    if (offset) {
      _offset = offset;
    }
    let _range = 5000000000000;
    if (range) {
      _range = range;
    }
    const { lat, long } = gcj02Towgs84(latitude, longitude);
    const [rows] = await db.sequelize.query(
      `
      select
          id as post_id,
          username,
          avatar,
          content,
          city,
          created_at,
          st_x(location) as lat,
          st_y(location) as long
      from
          timvel_db.wx_user_posts
      where 
      ST_Distance(
      ST_GeomFromText('POINT(? ?)',4326)::geography,
      location::geography) < ?
      order by created_at desc
      limit 300
      offset ?
      `,
      {
        replacements: [lat, long, _range, _offset],
      },
    );
    let data = rows.map(item => toCamelObject(item));
    let newData = data.map(item => {
      let { lat, long } = wgs84Togcj02(item.lat, item.long);
      return {
        postId: item.postId,
        username: item.username,
        avatar: item.avatar,
        content: item.content,
        city: item.city,
        createdAt: item.createdAt,
        latitude: lat,
        longitude: long,
      };
    });
    res.status(200).json(newData);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

export default router;
