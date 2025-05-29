import Cliente from './Cliente.js';
import Producto from './Producto.js';
import Venta from './Venta.js';
import DetalleVenta from './DetalleVenta.js';

//Asociaciones
Cliente.hasMany(Venta, { 
    foreignKey: 'clienteId',
    as: 'ventas'
});
Venta.belongsTo(Cliente, { 
    foreignKey: 'clienteId',
    as: 'cliente'
});

Venta.hasMany(DetalleVenta, { 
    foreignKey: 'ventaId',
    as: 'detalles'
});
DetalleVenta.belongsTo(Venta, { 
    foreignKey: 'ventaId',
    as: 'venta'
});

Producto.hasMany(DetalleVenta, { 
    foreignKey: 'productoId',
    as: 'detallesVenta'
});
DetalleVenta.belongsTo(Producto, { 
    foreignKey: 'productoId',
    as: 'producto'
});

//Exportar todos los modelos
export { Cliente, Producto, Venta, DetalleVenta };