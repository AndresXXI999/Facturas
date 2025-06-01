import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'USUARIO'
});

export default Usuario;