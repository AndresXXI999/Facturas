import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';

// Importar rutas
import clienteRoutes from './routes/clienteRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Facturas API - Sistema de Facturación',
        version: '1.0.0',
        endpoints: {
            clientes: '/api/clientes',
            productos: '/api/productos',
            ventas: '/api/ventas'
        }
    });
});

// API Routes
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

// Error handling middleware
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

// Database sync function
async function syncDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('Base de datos sincronizada correctamente');
    } catch (error) {
        console.error('Error sincronizando la base de datos:', error);
    }
}

export { app, syncDatabase };