const { Sequelize, DataTypes, Model } = require('sequelize');
const { db } = require('../configuration');


const sequelize = new Sequelize(db.name, db.user, db.password, {
    host: db.host,
    dialect: 'postgres',
    logging: true,
});

const TABLE_NAME = {
    NEWS: 'news',
}

const News = sequelize.define(TABLE_NAME.NEWS, {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: DataTypes.TEXT('medium'),
    body: DataTypes.TEXT('long'),
    link: DataTypes.STRING,
    keywords: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    date: DataTypes.DATE,
});

module.exports = {
    TABLE_NAME,
    sequelize,
    News
};
