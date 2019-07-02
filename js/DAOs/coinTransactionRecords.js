/*
 * File: /Users/origami/Desktop/timvel-server/js/DAOs/coinTransactionRecords.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday March 16th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Saturday March 16th 2019 10:51:01 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import db from '../config/db';
import { HANDLER, toCamelObject } from '../utils';
import { from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/internal/operators';
const insertNew = ({
  user_id,
  type,
  amount,
  product_id = null,
  child_id = null,
}) => {
  from(
    db.sequelize.query(
      `
    insert into timvel_db.coin_transaction_records(user_id, type, amount, product_id, child_id)
    values(:user_id,:type,:amount,:product_id,:child_id)
    `,
      {
        replacements: { user_id, type, product_id, child_id, amount },
      },
    ),
  ).subscribe(HANDLER());
};


export { insertNew };
