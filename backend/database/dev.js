const config = require('../config/mysql.dev');

const main = require('./init');
main(config).then();