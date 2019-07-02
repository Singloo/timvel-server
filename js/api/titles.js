import {} from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { HANDLER, retry3, toCamelObject } from '../utils';
import { Title } from '../DAOs';
import { Router } from 'express';
import db from '../config/db';
const router = Router();
router.post('/', async (req, res) => {
  try {
    const { title, user_id, color, description } = req.body;
    const data = await Title.insertTitle({
      title,
      user_id,
      color,
      description,
    });
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.get('/', (req, res) => {
  const { user_id } = req.query;
  retry3(
    db.sequelize.query(
      `
      select
      *
      from api.user_titles
      where user_id = ?

      `,
      {
        replacements: [user_id],
      },
    ),
  )
    .pipe(map(([rows]) => rows.map(toCamelObject)))
    .subscribe(
      HANDLER(data => res.status(200).json(data), () => res.status(500).send()),
    );
});

export default router