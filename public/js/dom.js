import { obtenerCitasAPI, eliminarCitaAPI } from './api.js';

//Mostrar citas
export function mostrarCitas(citas){
    console.time('mostrarCitas');

    const listaCitas = document.querySelector('#dates');
    listaCitas.innerHTML='';

    citas.forEach(cita => {
        const li = document.createElement('li');
        li.classList.add('item-cita');

        // 🔥 Tipo de cita
        let tipoCita = '';
        if (cita.medidasCita) tipoCita = 'Medida';
        if (cita.entregasCita) tipoCita = 'Entrega';

        // 🔥 Vendedora (CORREGIDO alias Sequelize)
        const nombreVendedora = cita.vendedora?.nombreVendedora || 'Sin asignar';

        // 🔥 Contenido
        const info = document.createElement('span');
        info.textContent = `Cliente: ${cita.nombreCliente} | 
        Tel: ${cita.telefonoCliente || 'N/A'} | 
        Vendedora: ${nombreVendedora} | 
        Tipo: ${tipoCita} | 
        Evento: ${cita.fechaEvento} | 
        Hora: ${cita.hora}`;

        // ✏️ Editar
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.dataset.id = cita.id_Cita;

        // 🔥 AQUÍ ESTÁ LA MAGIA
        btnEditar.dataset.cita = JSON.stringify(cita);

        btnEditar.classList.add('btnEditar');

        // ❌ Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.dataset.id = cita.id_Cita;
        btnEliminar.classList.add('btnEliminar');

        li.appendChild(info);
        li.appendChild(btnEliminar);
        li.appendChild(btnEditar);

        listaCitas.appendChild(li);
    });

    console.timeEnd('mostrarCitas');
}


//Mensajes
export function mostrarMensaje(mensaje, color) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.backgroundColor = color;
    mensajeDiv.style.color = 'white';
    mensajeDiv.style.padding = '10px';
    mensajeDiv.style.margin = '10px';
    mensajeDiv.style.borderRadius = '5px';
    mensajeDiv.style.textAlign = 'center';

    const form = document.getElementById('formCita');
    if (form) {
        form.prepend(mensajeDiv);
    } else {
        document.body.prepend(mensajeDiv);
    }

    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}


// 🔄 Actualización automática + eventos
export function iniciarActualizacionCitas() {

    const listaCitas = document.querySelector('#dates');
    if (!listaCitas) return;

    // 🎯 Delegación de eventos
    listaCitas.addEventListener('click', async (e) => {

        // ✏️ EDITAR
        if(e.target.classList.contains('btnEditar')){
            const cita = JSON.parse(e.target.dataset.cita);

            console.log('Editar cita', cita);

            // 🔥 LLENAR MODAL
            document.getElementById('editId').value = cita.id_Cita;

            document.getElementById('cliente').value = cita.nombreCliente;
            document.getElementById('telefono').value = cita.telefonoCliente || '';
            document.getElementById('codigo').value = cita.codigoVestido;
            document.getElementById('fechaEvento').value = cita.fechaEvento;
            document.getElementById('medidasCita').value = cita.medidasCita;
            document.getElementById('entregasCita').value = cita.entregasCita;
            document.getElementById('hora').value = cita.hora;
            document.getElementById('id_Vendedora').value = cita.id_Vendedora;

            document.getElementById('modalUpdate').style.display = 'flex';
        }

        // ❌ ELIMINAR
        if(e.target.classList.contains('btnEliminar')){
            const id = e.target.dataset.id;

            if(confirm('¿Seguro que quieres eliminar esta cita?')){
                try {
                    await eliminarCitaAPI(id);
                    mostrarMensaje('Cita eliminada correctamente', 'green');

                    const citas = await obtenerCitasAPI();
                    mostrarCitas(citas);

                } catch (error) {
                    console.error(error);
                    mostrarMensaje('Error al eliminar cita', 'red');
                }
            }
        }
    });

    // 🔄 Actualizar citas desde backend
    async function actualizarCitas() {
        try {
            const citas = await obtenerCitasAPI();
            mostrarCitas(citas);
        } catch (err) {
            console.error('Error al obtener citas:', err);
        }
    }

    // ⏱️ Cada 5 segundos
    setInterval(actualizarCitas, 5000);

    // Inicial
    actualizarCitas();
}