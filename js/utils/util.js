import Moment from 'moment';
import _ from 'lodash';
const toCamelObject = obj => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    newObj[_.camelCase(key)] = obj[key];
  });
  return newObj;
};

const invoke = (...funcs) => funcs.forEach(func => func && func());

export { toCamelObject, invoke };
