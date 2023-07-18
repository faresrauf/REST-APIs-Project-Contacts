const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'contactsAgenda',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql'
    });

module.exports = sequelize;