import { sequelize } from '../config/database.js';

async function resetDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('✅ Base de datos reiniciada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error reiniciando base de datos:', error);
        process.exit(1);
    }
}

resetDatabase();