import { Sequelize } from 'sequelize';
import 'dotenv/config';

//Siempre asegurarse de que los parametros en .env concidan con lo que tenemos en la Base de Datos
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mssql',
        port: parseInt(process.env.DB_PORT), //convertir cadena a numero
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        }
    }
);

//Funcion para probar si la base de datos esta activa y funcionando
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexion a SQL establecida");
    } catch(error) {
        console.error("No se pudo establecer la conexion", error);
    }
})();