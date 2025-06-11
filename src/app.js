import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';

// Importar rutas
import clienteRoutes from './routes/clienteRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import facturaRoutes from './routes/facturaRoutes.js';
import proveedorRoutes from './routes/proveedorRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'Ver archivo README.md en la carpeta del proyecto',
        ubicacion: 'facturas/README.md',
        api_endpoints: {
            clientes: '/api/clientes',
            productos: '/api/productos',
            facturas: '/api/facturas',
            proveedores: '/api/proveedores',
            usuarios: '/api/usuarios'
        }
    });
});

// API Routes
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Manejo de errores para Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: err.message 
    });
});

// 404 handler - wildcards (*) deben tener un nombre en Express v5
app.use('/*splat', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl 
    });
});

// Funcion para sincronizar base de datos
async function syncDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('Base de datos sincronizada correctamente');
    } catch (error) {
        console.error('Error sincronizando la base de datos:', error);
    }
}

export { app, syncDatabase };