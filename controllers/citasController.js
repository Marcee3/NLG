import Cita from "../models/Citas.js";
import Vendedora from "../models/Vendedoras.js";
import { Op } from "sequelize";
//Obtener citas y busqueda de las mismas
const getCitas = async(req, res) =>{
    try {
        const {buscar, fechaCita, tipoCita, ordenar} = req.query;
        let where= {};
        if(buscar){
            where.nombreCliente = {
                [Op.like]: `%${buscar}%`
            };
        } if (fechaCita) {
            where[Op.or] = [
                { medidasCita: fechaCita },
                { entregasCita: fechaCita }
            ];
        }

        // ⚠️ tipoCita (medidas o entrega)
        if (tipoCita === 'medida') {
            where.medidasCita = { [Op.ne]: null };
        }
        if (tipoCita === 'entrega') {
            where.entregasCita = { [Op.ne]: null };
        }

        const citas = await Cita.findAll({
            where,
            include: [{
                model: Vendedora,
                as: 'vendedora',
                attributes: ['nombreVendedora']
            }],
            order: ordenar === 'vendedora'
        ? [[{ model: Vendedora, as: 'vendedora' }, 'nombreVendedora', 'ASC']] // 👈 también aquí
        : [['fechaEvento', 'ASC']]
        });

        res.json(citas);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al obtener citas' });
    }
}

//Agregar citas
//Agregar citas (CORREGIDO)
const saveCitas = async (req, res) => {
    try {
        const {
            nombreCliente,
            telefonoCliente,
            codigoVestido,
            fechaEvento,
            medidasCita,
            entregasCita,
            hora,
            id_Vendedora
        } = req.body;

        // 🔍 Verificación rápida
        console.log(req.body);

        const nuevaCita = await Cita.create({
            nombreCliente,
            telefonoCliente,
            codigoVestido,
            fechaEvento,
            medidasCita,
            entregasCita,
            hora,
            id_Vendedora
        });

        res.json({
            mensaje: 'Cita registrada correctamente',
            cita: nuevaCita
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al guardar la cita'
        });
    }
};

//Borrar citas
const deleteCitas = async (req, res) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findByPk(id);

        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        await cita.destroy();

        res.json({
            mensaje: 'Cita eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al eliminar cita' });
    }
};
//Editar citas
const updateCitas = async (req, res) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findByPk(id);

        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        await cita.update(req.body);

        res.json({
            mensaje: 'Cita actualizada correctamente',
            cita
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar cita' });
    }
};

export{
    getCitas,
    saveCitas,
    deleteCitas,
    updateCitas
}