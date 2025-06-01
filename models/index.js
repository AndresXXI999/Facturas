import Cliente from './Cliente.js';
import Producto from './Producto.js';
import Factura from './Factura.js';  // Renamed
import DetalleFactura from './DetalleFactura.js';  // Renamed
import Proveedor from './Proveedor.js';  // New
import Usuario from './Usuario.js';  // New

// Cliente-Factura
Cliente.hasMany(Factura, { 
    foreignKey: 'clienteId',
    as: 'facturas'
});
Factura.belongsTo(Cliente, { 
    foreignKey: 'clienteId',
    as: 'cliente'
});

// Factura-DetalleFactura
Factura.hasMany(DetalleFactura, { 
    foreignKey: 'facturaId',
    as: 'detalles'
});
DetalleFactura.belongsTo(Factura, { 
    foreignKey: 'facturaId',
    as: 'factura'
});

// Producto-DetalleFactura
Producto.hasMany(DetalleFactura, { 
    foreignKey: 'productoId',
    as: 'detallesFactura'
});
DetalleFactura.belongsTo(Producto, { 
    foreignKey: 'productoId',
    as: 'producto'
});

// Proveedor-Producto
Proveedor.hasMany(Producto, { 
    foreignKey: 'proveedorId',
    as: 'productos'
});
Producto.belongsTo(Proveedor, { 
    foreignKey: 'proveedorId',
    as: 'proveedor'
});

// Usuario-Factura
Usuario.hasMany(Factura, { 
    foreignKey: 'usuarioId',
    as: 'facturas'
});
Factura.belongsTo(Usuario, { 
    foreignKey: 'usuarioId',
    as: 'usuario'
});

export { 
    Cliente, 
    Producto, 
    Factura, 
    DetalleFactura, 
    Proveedor, 
    Usuario 
};