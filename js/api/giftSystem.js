import { toCamelObject, coinTransaction } from '../utils';
import { CoinTransactionRecords } from '../DAOs';
import db from '../config/db';
import { Router } from 'express';
const router = Router();
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const [rows] = await db.sequelize.query(
      `
      select
      *
      from timvel_db.user_gifts
      where user_id = ?
      `,
      {
        replacements: [user_id],
      },
    );
    const data = rows.map(toCamelObject);
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.post('/send', async (req, res) => {
  try {
    const { sender, receiver, gift_type } = req.body;
    let gift = 'flowers';
    let price = 100;
    if (parseInt(gift_type) > 100) {
      gift = 'shits';
      price = 200;
    }
    const [rows] = await db.sequelize.query(
      `
        insert into timvel_db.user_gifts(user_id,${gift})
        values (?,1)
        on conflict(user_id)
        do
        update
        set 
        ${gift} = user_gifts.${gift} + 1,
        updated_at = now()
        returning id
        `,
      {
        replacements: [receiver],
      },
    );
    const id = rows[0].id;
    const [row] = await db.sequelize.query(
      `
      insert into timvel_db.gift_history(user_gift_id,receiver_user_id,sender_user_id,gift_type)
      values(?,?,?,?)
      returning id
      `,
      {
        replacements: [id, receiver, sender, gift_type],
      },
    );
    await coinTransaction(sender, -price);
    CoinTransactionRecords.insertNew({
      user_id: sender,
      amount: -price,
      type: 'send_gift',
      child_id: row[0].id,
    });
    res.status(200).send();
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

export default router;
