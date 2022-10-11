import express from 'express';
require('dotenv').config({path: __dirname + '/../.env'});
import sequelize from '../config/sequelize'
const users = require('./routes/users');
const lists = require('./routes/lists');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/users', users);
app.use('/lists', lists);


app.listen(process.env.PORT, ()  => {
  return console.log(`Backend server runs on ss port ${process.env.PORT}`);
});

module.exports = {sequelize};