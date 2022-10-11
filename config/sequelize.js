const { Sequelize } = require('sequelize');
require('dotenv').config({path: __dirname + '/../.env'});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

sequelize
    .authenticate()
    .then(() => console.log('Connection has been estabilished..'))
    .catch(error => console.error(`${error}: Unable to connect to database`))

    module.exports = { sequelize };