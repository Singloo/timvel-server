import express from 'express';
import fs from 'fs';
import db from './db';
import apiV1 from '../api';
import bodyParser from 'body-parser';
import path from 'path';
import AboutMeMD from '../statics/aboutMe';
import PrivacyMD from '../statics/privacy';
import wx from '../api/wxApp';
import Ai from '../ai/api';
const app = express();
const homeHtml = fs.readFileSync(__dirname + '/../../build/index.html', 'utf8');
app.use(bodyParser.json({ limit: '3mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '3mb',
  }),
);
app.use('/', express.static(path.join(__dirname, '/../../build')));
app.get('/', (req, res) => {
  res.send(homeHtml);
});
app.get('/aboutMe', (req, res) => {
  res.send(homeHtml);
});
app.get('/privacy', (req, res) => {
  res.send(PrivacyMD);
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
db.sequelize
  .authenticate()
  .then(() => {
    console.warn('connect successfully');
  })
  .catch(error => {
    console.warn('error', error);
  });

app.use('/api/v1', apiV1);
app.use('/ai', Ai);
app.use('/wx', wx);
const server = app.listen(8080, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.warn('http://%s:%s', host, port);
});
