export async function obtenerCitasAPI() {
    const res = await fetch('/api/citas');

    if (!res.ok) {
        throw new Error('Error al obtener citas');
    }

    return await res.json();
}

export async function crearCitaAPI(datos) {
    const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(datos)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || 'Error al crear la cita');
    }

    return await res.json();
}

export async function eliminarCitaAPI(id) {
    const res = await fetch(`/api/citas/${id}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        throw new Error('Error al eliminar la cita');
    }

    return await res.json();
}

export async function actualizarCitaAPI(id, datos) {
    const res = await fetch(`/api/citas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || 'Error al actualizar la cita');
    }

    return await res.json();
}