import {
  readNotification,
  insertNotifation,
  getNotification,
} from '../DAOs/notification';
import db from '../config/db';
import {} from 'rxjs';
import {} from 'rxjs/internal/operators';
import { Router } from 'express';
const router = Router();
router.post('/', (req, res) => {
  const { type, receiver_user_id, ...rest_props } = req.body;
  insertNotifation({
    type,
    receiver_user_id,
    ...rest_props,
  }).subscribe(() => {
    res.status(200).send({
      success: true,
    });
  });
});
router.get('/', (req, res) => {
  const { user_id, type } = req.query;
  if (!user_id || !type) {
    res.status(200).send({
      success: false,
      message: 'User id or type lost in params',
    });
    return;
  }
  getNotification(user_id, type).subscribe(data => {
    res.status(200).send({
      success: true,
      data,
    });
  });
});
router.put('/read', (req, res) => {
  const { notification_ids } = req.body;
  readNotification(notification_ids);
  res.status(200).send({
    success: true,
  });
});
router.use((err, req, res, next) => {
  console.warn(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'generic error',
  });
});
export default router;
