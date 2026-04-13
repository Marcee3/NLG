import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../settings/db.js";

const Vendedora = db.define('vendedora', {
    id_Vendedora: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombreVendedora:{
        type: DataTypes.STRING,
        allowNull: false
    },
    telefonoVendedora:{
        type: DataTypes.STRING,
        allowNull: true
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    contrasena:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('superadmin','admin', 'editor', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
    token_recuperacion: DataTypes.STRING, // Para recuperación de contraseña
    token_expiracion: DataTypes.DATE, 
},
 {
    tableName: 'vendedoras',
    timestamps: false        
}, {
    hooks:{
        beforeCreate: async function (vendedora) {
            const salt = await bcrypt.genSalt(10);
            vendedora.contrasena= await bcrypt.hash(vendedora.contrasena, salt);
        }
    }
}
);

export default Vendedora;