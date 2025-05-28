import 'dotenv/config'; //Cargar .env
import app from './app.js';

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor facturas corriendo en servidor ${PORT}`); //Uso de backquotes no single ni double quotes
});