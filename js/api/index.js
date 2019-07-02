import TransactionRouter from './transaction';
import TitleRouter from './titles';
import GiftsRouter from './giftSystem';
import NotificationRouter from './notification';
import CoinTransactionRecordsRouter from './coinTransactionRecords';
import PostRouter from './post';
import PostTagRouter from './postTag';
import UserRouter from './user';
import AV from 'leancloud-storage';
import Universal from './universal';
import ReportRouter from './report';
import {} from 'rxjs/operators';
import { Router } from 'express';
const apiV1 = Router();
AV.init({
  appId: process.env.LC_APP_ID,
  appKey: process.env.LC_APP_KEY,
  masterKey: process.env.LC_MASTER_KEY,
});
AV.Cloud.useMasterKey();
apiV1.use('/universal', Universal);
apiV1.use('/notification', NotificationRouter);
apiV1.use('/product', TransactionRouter);
apiV1.use('/title', TitleRouter);
apiV1.use('/transaction_records', CoinTransactionRecordsRouter);
apiV1.use('/gift', GiftsRouter);
apiV1.use('/post', PostRouter);
apiV1.use('/tag', PostTagRouter);
apiV1.use('/user', UserRouter);
apiV1.use('/report', ReportRouter);

export default apiV1;
