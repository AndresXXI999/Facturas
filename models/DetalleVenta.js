import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize';

const DetalleVenta = sequelize.define('DetalleVenta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ventaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'DetalleVenta'
});

export default DetalleVenta;