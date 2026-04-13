const loader = document.getElementById("loader");
const totalCitas = document.getElementById("totalCitas");
const listaClientes = document.getElementById("listaClientes");
const listaCitas = document.getElementById("listaCitas");

async function cargarDashboard(){

    loader.style.display = "block";

    try{

        const res = await fetch("/api/citas");
        const citas = await res.json();

        totalCitas.textContent = citas.length;

        //clientes únicos
        const clientes = [...new Set(citas.map(c => c.cliente))];

        clientes.forEach(cliente => {
            const li = document.createElement("li");
            li.textContent = cliente;
            listaClientes.appendChild(li);
        });

        //últimas citas
        citas.slice(0,5).forEach(cita => {

            const li = document.createElement("li");
            li.textContent = `${cita.cliente} - ${cita.fechaCita} (${cita.tipoCita})`;

            listaCitas.appendChild(li);

        });

    }catch(error){

        console.error("Error cargando dashboard", error);

    }

    loader.style.display = "none";
}

document.addEventListener("DOMContentLoaded", cargarDashboard);