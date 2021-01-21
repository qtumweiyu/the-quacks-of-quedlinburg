const config = require('../config/mysql.prod');

const main = require('./init');
main(config).then();