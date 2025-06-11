import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Proveedor = sequelize.define('Proveedor', {
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
    },
    correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'PROVEEDOR'
});

export default Proveedor;