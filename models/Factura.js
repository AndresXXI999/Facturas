import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize';

const Factura = sequelize.define('Factura', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    usuarioId: {  // Added field
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false,
    tableName: 'FACTURA'  // Updated table name
});

export default Factura;