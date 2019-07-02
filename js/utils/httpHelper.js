import AV from 'leancloud-storage';
import Axios from 'axios';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators';
import { retry3, HANDLER } from './$helper';
const hostClient = Axios.create({
  timeout: 10000,
  baseURL: process.env.TIMVEL_HOST,
});

const coinTransaction = async (userId, amount) => {
  const user = AV.Object.createWithoutData('_User', userId);
  user.increment('userCoin', parseInt(amount, 10));
  return await user.save();
};

export { hostClient, coinTransaction };
