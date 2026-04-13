import { mostrarMensaje, mostrarCitas } from "./dom.js";
import { debounce } from "./data.js";
import { crearCitaAPI, eliminarCitaAPI, actualizarCitaAPI} from "./api.js";
// IMPLEMENTACION DE WEB SOCKET
import { iniciarActualizacionCitas } from './dom.js';

document.addEventListener('DOMContentLoaded', () => {
    iniciarActualizacionCitas();
});
window.addEventListener("scroll", function(){
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 10);
});

document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if(entry.isIntersecting){
        entry.target.style.transitionDelay = `${index * 0.5}s`;
        entry.target.classList.add("active");
        }
    });
    }, {
    threshold: 0.2
    });
    reveals.forEach((reveal) => {
        observer.observe(reveal);
    });
});


document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.preventDefault(); // solo para probar animación
            card.classList.toggle("hidden");
        });
    });

});

function throttle(fn, limit) {
    let waiting = false;

    return function (...args) {
        if (!waiting) {
            fn.apply(this, args);
            waiting = true;
            setTimeout(() => waiting = false, limit);
        }
    }
}

window.addEventListener("scroll", throttle(() => {
    console.log("Scroll optimizado");
}, 200));

//Formulario para agregar citas
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCita');
    if(form){
        form.addEventListener('submit', async (e) =>{
            e.preventDefault();
            const confirmar = confirm('¿Deseas agendar esta cita?');
            if (!confirmar) {
                mostrarMensaje('Registro cancelado', 'orange');
                return;
            }
            //Campos para registrar una cita
            const datos = {
    nombreCliente: document.getElementById('cliente').value,
    telefonoCliente: document.getElementById('telefono').value,
    codigoVestido: document.getElementById('codigo').value,
    fechaEvento: document.getElementById('fechaEvento').value,
    medidasCita: document.getElementById('medidasCita').value,
    entregasCita: document.getElementById('entregasCita').value,
    hora: document.getElementById('hora').value,
    id_Vendedora: document.getElementById('id_Vendedora').value
};
console.log(datos);
            try{
                const data = await crearCitaAPI(datos);
                mostrarMensaje(data.mensaje, 'green');
                form.reset();
            } catch(error) {
                console.log(error);
                mostrarMensaje('Error al registrar la cita', 'red');
            }
        });
    }
});

//Eliminar citas
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('btnEliminar')) {
        const id = e.target.dataset.id;
        const confirmar = confirm('¿Deseas eliminar esta cita?');
        if (!confirmar) return;
        let data;
        try {
            data = await eliminarCitaAPI(id);
        } catch(e){
            console.log("Servidor no encontró la cita, eliminando localmente");
            data = { mensaje: "Cita eliminada localmente" };
        }
        //No recarga la página
        const li = e.target.parentElement;
        li.remove();
        let citas = JSON.parse(localStorage.getItem('citas')) || [];
        citas = citas.filter(c=> c.id != id);
        localStorage.setItem('citas', JSON.stringify(citas));

        mostrarMensaje(data.mensaje, 'green');
    }
});


//Modal para editar citas
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnEditar')){

        const id = e.target.dataset.id;

        // 🔥 BUSCAMOS LA CITA DESDE EL DOM (texto)
        const li = e.target.closest('li');

        document.getElementById('editId').value = id;

        document.getElementById('cliente').value = li.querySelector('.cliente').textContent;
        document.getElementById('telefono').value = li.querySelector('.telefono').textContent;
        document.getElementById('codigo').value = li.querySelector('.codigo').textContent;
        document.getElementById('fechaEvento').value = li.querySelector('.fechaEvento').textContent;
        document.getElementById('medidasCita').value = li.querySelector('.medidasCita').textContent;
        document.getElementById('entregasCita').value = li.querySelector('.entregasCita').textContent;
        document.getElementById('hora').value = li.querySelector('.hora').textContent;

        // ⚠️ ESTE ES IMPORTANTE
        document.getElementById('id_Vendedora').value = li.dataset.id_vendedora;

        document.getElementById('modalUpdate').style.display = 'flex';
    }
});
//Formulario para editar citas
const formEditar = document.getElementById('formUpdate');
if (formEditar) {
    formEditar.addEventListener('submit', async (e) =>   {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const datosActualizados = {
            nombreCliente: document.getElementById('cliente').value,
            telefonoCliente: document.getElementById('telefono').value,
            codigoVestido: document.getElementById('codigo').value,
            fechaEvento: document.getElementById('fechaEvento').value,
            medidasCita: document.getElementById('medidasCita').value,
            entregasCita: document.getElementById('entregasCita').value,
            hora: document.getElementById('hora').value,
            id_Vendedora: document.getElementById('id_Vendedora').value
        };
        try {
            const resp = await actualizarCitaAPI(id, datosActualizados);

            mostrarMensaje(resp.mensaje || "Cita actualizada correctamente", "green");

            document.getElementById('modalUpdate').style.display = 'none';

            // 🔥 Recargar datos reales desde servidor
            location.reload();

        } catch (error) {
            console.log(error);
            mostrarMensaje("Error al actualizar la cita", "red");
        }
            });
};

//Cerrar el bloque del modal
const cerrarModal = document.getElementById('cerrarModal');
if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
        document.getElementById('modalUpdate').style.display = 'none';
    });
}

//Formulario para buscar/filtrar/ordenar
const formBuscar = document.getElementById('formBuscar');
if (formBuscar) {
    formBuscar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const buscar = document.getElementById('buscarInput').value;
        const tipo = document.getElementById('tipoFiltro').value;
        const ordenar = document.getElementById('ordenFiltro').value;

        let citas = JSON.parse(localStorage.getItem('citas')) || [];  
        //Se obtienen todas las citas guardadas
        //Filtros
        if (buscar) {
            citas = citas.filter(c =>
                c.cliente.toLowerCase().includes(buscar.toLowerCase())
            );
        }
        if (tipo) {
            citas = citas.filter(c =>
                c.tipoCita === tipo
            );
        }
        if (ordenar === 'vendedora') {
            citas.sort((a, b) =>
                a.vendedora.localeCompare(b.vendedora)
            );
        }
        mostrarCitas(citas);
    });
}

const buscador = document.querySelector("#buscador");
    if(buscador){
        buscador.addEventListener("input", debounce((e) => {
        filtrarVestidos(e.target.value);
        }, 300));
    }
        

//Preferencias de tema e idioma
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('toggleTema');

    // aplicar tema guardado
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'dark') {
        document.body.classList.add('dark');
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark');

        // guardar preferencia
        const esOscuro = document.body.classList.contains('dark');
        localStorage.setItem('tema', esOscuro ? 'dark' : 'light');
    });
});

const textos = {
    es: {
        empresa: "Novias Los Gatitos",
        nosotros: "Nosotros",
        catalogos: "Catálogos",
        novias: "Novias",
        xv: "XV",
        contacto: "Contacto",
        login: "Iniciar",

        nosotros_desc1: "Somos una empresa para novias y quinceañeras.",
        nosotros_desc2: "Queremos hacer realidad tus sueños ofreciendo diseños únicos.",

        mision: "Misión",
        mision_desc: "Ser una empresa líder en vestidos.",

        vision: "Visión",
        vision_desc: "Hacer realidad los sueños de las jóvenes.",

        ubicacion: "Ubicación",
        ubicacion_text: "Nos encontramos aquí:"
    },

    en: {
        empresa: "Bridal Los Gatitos",
        nosotros: "About us",
        catalogos: "Catalogs",
        novias: "Brides",
        xv: "XV",
        contacto: "Contact",
        login: "Login",

        nosotros_desc1: "We are a company for brides and quinceañeras.",
        nosotros_desc2: "We make your dreams come true with unique designs.",

        mision: "Mission",
        mision_desc: "To be a leading company in dresses.",

        vision: "Vision",
        vision_desc: "Make dreams come true for young women.",

        ubicacion: "Location",
        ubicacion_text: "We are located here:"
    }
};
