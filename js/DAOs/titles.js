/*
 * File: /Users/origami/Desktop/timvel-server/js/DAOs/titles.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Friday March 15th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Saturday March 16th 2019 9:55:29 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import db from '../config/db';
import { HANDLER, toCamelObject } from '../utils';
import { from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/internal/operators';

const addTitleToUser = (user_id, title_id) => {
  return db.sequelize.query(
    `
    insert into timvel_db.user_titles(user_id,title_id,is_wearing)
    values(?,?,true)
    on conflict
    do nothing
    `,
    {
      replacements: [user_id, title_id],
    },
  );
};

const insertTitle = async ({ title, color, description, user_id }) => {
  const [rows] = await db.sequelize.query(
    `
    insert into timvel_db.titles(title,color,description,user_id)
    values(?,?,?,?)
    on conflict
    do nothing
    returning id
    `,
    {
      replacements: [title, color, description, user_id],
    },
  );
  if (rows.length === 0) {
    return {
      repeated: true,
    };
  }
  return {
    repeated: false,
    id: rows[0].id,
  };
};
export { addTitleToUser, insertTitle };
