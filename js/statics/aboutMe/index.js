/*
 * File: /Users/origami/Desktop/timvel-server/js/statics/aboutMe/index.js
 * Project: /Users/origami/Desktop/timvel-server
 * Created Date: Thursday April 4th 2019
 * Author: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 * Last Modified: Monday April 29th 2019 10:49:56 am
 * Modified By: Rick yang tongxue(🍔🍔) (origami@timvel.com)
 * -----
 */
import fs from 'fs';
import path from 'path';
import marked from 'marked';
const aboutMe = fs.readFileSync(
  path.resolve(__dirname, './aboutMe.md'),
  'utf8',
);

const str = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>What are you looking for?</title>
</head>
<body>
<div id="content"></div>
<script>
  document.getElementById('content').innerHTML =
   "${marked(aboutMe).trim()}";
</script>
</body>
</html>
`;
export default str;
