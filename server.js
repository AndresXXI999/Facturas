import 'dotenv/config';
import { app, syncDatabase } from './app.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Sync database first
        await syncDatabase();
        
        // Then start the server
        app.listen(PORT, () => {
            console.log(`🚀 Servidor de facturas corriendo en puerto ${PORT}`);
            console.log(`📡 API disponible en: http://localhost:${PORT}`);
            console.log(`📚 Documentación: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('❌ Error iniciando el servidor:', error);
        process.exit(1);
    }
}

startServer();