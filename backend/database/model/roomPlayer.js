const { DataTypes } = require('sequelize');

const define = sequelize => {
    sequelize.define('room_player', {
        roomId: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        playerId: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        status: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        joinAt: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
        charset: 'utf8mb4',
        indexes: [{ unique: true, fields: ['playerId'] }, { fields: ['roomId', 'joinAt', 'playerId'] }],
    });
};

module.exports = define;