const { Sequelize, DataTypes, Model } = require('sequelize');
const { db } = require('../configuration');


// Создаем объект Sequelize и подключаемся к базе данных
const sequelize = new Sequelize(db.name, db.user, db.password, {
    host: 'localhost',   // Или другой хост, если база данных не локальная
    dialect: 'postgres', // Указываем PostgreSQL как СУБД
});

// const sequelize = new Sequelize({
//     database: db.name,
//     user: db.user,
//     password: db.password,
//     // dialect: PostgresDialect,
//     dialect: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     logging: console.log
// });

const News = sequelize.define('News', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: DataTypes.STRING,
    body: DataTypes.TEXT('medium'),
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
