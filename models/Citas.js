import { DataTypes } from "sequelize";
import db from "../settings/db.js";

const Cita = db.define('cita', {
    id_Cita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombreCliente:{
        type: DataTypes.STRING,
        allowNull: false
    },
    telefonoCliente:{
        type: DataTypes.STRING,
        allowNull: true
    },
    codigoVestido:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaEvento:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    medidasCita:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    entregasCita:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora:{
        type: DataTypes.TIME,
        allowNull: false
    },
    id_Vendedora:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'citas',
    timestamps: false
});

export default Cita;