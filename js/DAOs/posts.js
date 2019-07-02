/*
 * File: /Users/origami/Desktop/timvel-server/js/DAOs/posts.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Thursday March 21st 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Wednesday April 3rd 2019 10:10:45 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import db from '../config/db';
import { HANDLER, toCamelObject } from '../utils';
import { from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/internal/operators';
import Moment from 'moment';
const getTimeFormat = precision => {
  switch (precision) {
    case 'day':
      return 'YYYY-MM-DD';
    case 'month':
      return 'YYYY-MM';
    case 'year':
      return 'YYYY';
    default:
      return 'YYYY-MM-DD';
  }
};
const $fetchPostsByPrecision = (date, precision = 'day') =>
  from(
    db.sequelize.query(
      `
    select
    *
    from api.posts
    where (to_char(happened_at::timestamp,:timeformat) = to_char(:date ::timestamp, :timeformat)  and precision = :precision)
    `,
      {
        replacements: {
          timeformat: getTimeFormat(precision),
          date,
          precision,
        },
      },
    ),
  ).pipe(map(([rows]) => rows));

const fetchPostsByInterval = async (date, interval, post_ids) => {
  const [rows] = await db.sequelize.query(
    `
      select
      *
      from api.posts
      where happened_at between ? and ? and post_id not in (?)
      limit 50
      `,
    {
      replacements: [
        Moment(date)
          .subtract(interval, 'days')
          .format(),
        date,
        post_ids,
      ],
    },
  );
  return rows;
};
const _nextInterval = interval => {
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
const fetchPostsByIntervalRecursive = async (
  date,
  interval,
  post_ids,
  times = 0,
) => {
  console.warn('recursive', interval, times);
  if (times >= 4) {
    return [];
  }
  const data = await fetchPostsByInterval(date, interval, post_ids);
  if (data.length === 0) {
    return fetchPostsByIntervalRecursive(
      date,
      _nextInterval(interval),
      post_ids,
      times + 1,
    );
  }
  return data;
};
export { $fetchPostsByPrecision, fetchPostsByIntervalRecursive };
