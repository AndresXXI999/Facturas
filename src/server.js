import 'dotenv/config';
import { app, syncDatabase } from './app.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Sincronizar la base de datos primero
        await syncDatabase();
        
        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();