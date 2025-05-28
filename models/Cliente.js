import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize';

const Cliente = sequelize.define(
    'Cliente', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        telefono: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
}, {
    timestamps: false
});

export default Cliente;