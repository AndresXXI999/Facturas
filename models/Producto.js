import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize';

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    precio_unitario: {  // Renamed field
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio_unitario'  // Maps to database column
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    proveedorId: {  // Added foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_proveedor'
    }
}, {
    timestamps: false,
    tableName: 'PRODUCTO'
});

export default Producto;