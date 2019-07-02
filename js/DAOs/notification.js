import db from '../config/db';
import { HANDLER, toCamelObject } from '../utils';
import { from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/internal/operators';
const dbResultMap = ([rows]) => rows;
const _filterNotificationByType = data => {
  const returnData = [];
  data.forEach(item => {
    const found = returnData.find(o => o.type === item.type);
    if (found) {
      found.data.push(item);
      return;
    }
    returnData.push({
      type: item.type,
      data: [item],
    });
  });
  return returnData;
};
const mapNotificationType = (user_id, type) => {
  if (type === 'comment') {
    return from(
      db.sequelize.query(
        `
        select
        notification.id as notification_id,
        notification.is_read,
        notification_comment.*
        from timvel_db.notification
        left join api.notification_comment
        on notification.id = notification_comment.notification_comment_id
        where user_id = ? and type = ?
        order by created_at desc
        limit 50
        `,
        {
          replacements: [user_id, type],
        },
      ),
    ).pipe(
      map(dbResultMap),
      map(data => data.map(toCamelObject)),
    );
  }
  return of([]);
};
const _insertComment = ({
  sender_user_id,
  receiver_user_id,
  post_id,
  comment_id,
  associated_comment_id = null,
}) =>
  from(
    db.sequelize.query(
      `
      insert into timvel_db.notification_comment(receiver_user_id,sender_user_id,post_id,comment_id,associated_comment_id)
      values(:receiver_user_id,:sender_user_id,:post_id,:comment_id,:associated_comment_id)
      returning id
      `,
      {
        replacements: {
          sender_user_id,
          receiver_user_id,
          post_id,
          comment_id,
          associated_comment_id,
        },
      },
    ),
  ).pipe(
    map(dbResultMap),
    map(row => ({
      child_id: row[0].id,
      user_id: receiver_user_id,
    })),
  );
const _insertChildToNotification = ({ child_id, type, user_id }) => {
  return from(
    db.sequelize.query(
      `
    insert into timvel_db.notification(user_id,type,child_id)
    values(:user_id,:type,:child_id)
    `,
      {
        replacements: { child_id, type, user_id },
      },
    ),
  );
};
const insertNotifation = ({ type, ...child_values }) =>
  of(type).pipe(
    switchMap(type => {
      if (type === 'comment') {
        return _insertComment(child_values);
      }
      throw new Error('type not exists');
    }),
    switchMap(values =>
      _insertChildToNotification({
        ...values,
        type,
      }),
    ),
  );

const readNotification = notification_ids =>
  from(
    db.sequelize.query(
      `
      update timvel_db.notification
      set 
      is_read = true,
      updated_at = now()
      where id in (?)
      `,
      {
        replacements: [notification_ids],
      },
    ),
  ).subscribe(HANDLER());

const getNotification = mapNotificationType;

export { insertNotifation, readNotification, getNotification };
