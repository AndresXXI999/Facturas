import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize';

const DetalleFactura = sequelize.define('DetalleFactura', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    facturaId: {
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
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio_unitario'
    }
}, {
    timestamps: false,
    tableName: 'DETALLE_FACTURA'
});

export default DetalleFactura;