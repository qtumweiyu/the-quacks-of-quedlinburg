const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const main = async ({ host, port, user, password, database }) => {
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
    });

    const dir = __dirname;

    fs.readdirSync(path.join(dir, 'model')).forEach(file => {
        if (file.endsWith('.js')) {
            const fn = require(path.join(dir, 'model', file));
            fn(sequelize);
        }
    });

    await sequelize.sync({ alter: true });

    console.log('init mysql done!');
};

module.exports = main;