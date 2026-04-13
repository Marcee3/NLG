import { Sequelize } from "sequelize";
import dotenv from "dotenv";// Para leer el archivo .env

dotenv.config({path: '.env'});

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USUARIO, process.env.BD_PASS ?? '', {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default db;