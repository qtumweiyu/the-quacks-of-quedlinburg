const { DataTypes } = require('sequelize');

const define = sequelize => {
    sequelize.define('room', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.TINYINT.UNSIGNED,
            defaultValue: 2,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        owner: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
        charset: 'utf8mb4',
        indexes: [{ unique: true, fields: ['createdBy'] }],
    });
};

module.exports = define;