const connection = require('../DB');
const { DataTypes } = require('sequelize');

const Contacts = connection.define('contacts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    {
        tableName: 'contacts',
        timestamps: false
    });

module.exports.Contacts = Contacts;
