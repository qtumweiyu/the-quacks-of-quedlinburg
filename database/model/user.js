const { DataTypes } = require('sequelize');

const define = sequelize => {
    sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hashPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
        charset: 'utf8mb4',
        indexes: [{ unique: true, fields: ['name'] }],
    });
};

module.exports = define;