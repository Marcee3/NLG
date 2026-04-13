import Vendedora from "./Vendedoras.js";
import Cita from "./Citas.js";

// Una vendedora tiene muchas citas
Vendedora.hasMany(Cita, {
    foreignKey: 'id_Vendedora',
    as: 'citas'
});

// Una cita pertenece a una vendedora
Cita.belongsTo(Vendedora, {
    foreignKey: 'id_Vendedora',
    as: 'vendedora'
});

export {
    Cita,
    Vendedora
};