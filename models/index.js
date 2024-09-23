const { Sequelize, DataTypes, Model } = require('sequelize');
const { db } = require('../configuration');


const sequelize = new Sequelize(db.name, db.user, db.password, {
    host: 'localhost',
    dialect: 'postgres',
});

const News = sequelize.define('News', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: DataTypes.TEXT('medium'),
    body: DataTypes.TEXT('long'),
    link: DataTypes.STRING,
    keywords: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: DataTypes.DATE,
});

module.exports = {
    sequelize,
    News
};
