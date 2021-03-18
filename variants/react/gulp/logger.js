const log = require('fancy-log');
const chalk = require('chalk');

/** Split dot notation */
const chalkMsg = (msg, str) => {
  return str.split('.')
    .reduce((obj, key) => {
      return obj[key];
    }, chalk)(msg);
};

/** Generic log with optional color */
const info = (msg, c1 = 'white') => log(chalkMsg(msg, c1));

/** Error log, with red error output */
const error = err => log(chalk.red.bold(err));

module.exports = { info, error };
