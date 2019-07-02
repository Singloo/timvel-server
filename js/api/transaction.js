import { toCamelObject, coinTransaction } from '../utils';
import { Router } from 'express';
import db from '../config/db';
import { Title, CoinTransactionRecords } from '../DAOs';
const router = Router();
router.post('/purchase', async (req, res) => {
  try {
    const {
      buyer_user_id,
      price,
      product_id,
      seller_user_id,
      product_type,
      title_id,
    } = req.body;
    await coinTransaction(buyer_user_id, -parseInt(price, 10));
    CoinTransactionRecords.insertNew({
      user_id: buyer_user_id,
      type: 'purchase_product',
      product_id,
      amount: -parseInt(price),
      child_id: product_id,
    });
    if (product_type === 'title') {
      await Title.addTitleToUser(buyer_user_id, title_id);
    }
    res.status(200).send();
    if (seller_user_id) {
      await coinTransaction(seller_user_id, parseInt(price, 10));
      CoinTransactionRecords.insertNew({
        user_id: seller_user_id,
        type: 'sell_product',
        product_id,
        amount: parseInt(price),
        child_id: product_id,
      });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image_url,
      user_id,
      product_type,
      title,
      color,
    } = req.body;
    let title_id = null;
    if (product_type === 'title') {
      const data = await Title.insertTitle({
        title,
        color,
        description,
        user_id,
      });
      if (data.repeated) {
        res.status(200).json({
          msg: 'title repeated',
          success: false,
        });
        return;
      }
      title_id = data.id;
    }
    await db.sequelize.query(
      `
      insert into timvel_db.products(name,description,price,image_url,user_id,product_type,status,title_id)
      values(:name,:description,:price,:image_url,:user_id,:product_type,:status,:title_id)
      `,
      {
        replacements: {
          name,
          description,
          price,
          image_url,
          user_id,
          product_type,
          status: 'waiting_review',
          title_id,
        },
      },
    );
    res.status(201).json({
      msg: 'success',
      success: true,
    });
    try {
      await db.sequelize.query(
        `
          insert into timvel_db.user_images(user_id,url,image_type)
          values(?,?,?)
          `,
        {
          replacements: [user_id, image_url, 'product'],
        },
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
    const { user_id } = req.query;
    /* eslint-disable-next-line */
    let sqlCondition = `where status = 'online'`;
    if (user_id) {
      sqlCondition = `where user_id = ${user_id}`;
    }
    const [rows] = await db.sequelize.query(
      `
        select
        *
        from api.products
        ${sqlCondition}
        `,
    );
    const data = rows.map(item => toCamelObject(item));
    res.status(200).json(data);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});
export default router;
