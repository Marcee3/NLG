import { mostrarCitas } from "/js/dom.js";
import { obtenerCitasAPI } from "/js/api.js";

document.addEventListener("DOMContentLoaded", async () => {

    const listaCitas = document.getElementById("dates");
    if (!listaCitas) return;

    try {
        const citas = await obtenerCitasAPI();
        mostrarCitas(citas);
    } catch (error) {
        console.error(error);
        listaCitas.innerHTML = "<p>Error al cargar citas</p>";
    }

});