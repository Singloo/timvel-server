/*
 * File: /Users/origami/Desktop/timvel-server/js/api/coinTransactionRecords.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Saturday March 16th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Saturday March 16th 2019 4:16:02 pm
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import { Router } from 'express';
import { CoinTransactionRecords } from '../DAOs';
const router = Router();
router.post('/', (req, res) => {
  const { user_id, type, amount, product_id = null, child_id = null } = req.body;
  CoinTransactionRecords.insertNew({
    user_id,
    type,
    amount,
    product_id,
    child_id,
  });
});
export default router;
