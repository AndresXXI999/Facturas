import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize';

//Modelo y creacion (en caso de no existir) del modelo cliente
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
        direccion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        correo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: { isEmail: true }
        }
}, {
    timestamps: false,
    tableName: 'CLIENTE'
});

export default Cliente;