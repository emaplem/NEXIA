
console.log("Nexia iniciado correctamente 🤖");

function generarId() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Date.now().toString() + Math.random().toString(16).slice(2);
}

function iniciarNexia() {
    alert("Hola 👋 Soy Nexia, tu asistente virtual. ¿En qué puedo ayudarte?");
}

function mostrarChat() {
    const chat = document.getElementById("chat-box");

    if (chat) {
        chat.scrollIntoView({ behavior: "smooth" });
    }
}

function obtenerTareas() {
    try {
        const datos = JSON.parse(localStorage.getItem("tareas")) || [];
        let huboCambios = false;

        const tareas = datos.map(function(tarea) {
            if (typeof tarea === "string") {
                huboCambios = true;

                return {
                    id: generarId(),
                    texto: tarea,
                    completada: false,
                    prioridad: "media"
                };
            }

            const tareaActualizada = {
                id: tarea.id || generarId(),
                texto: tarea.texto || "",
                completada: Boolean(tarea.completada),
                prioridad: ["alta", "media", "baja"].includes(tarea.prioridad)
                    ? tarea.prioridad
                    : "media"
            };

            if (
                !tarea.id ||
                !["alta", "media", "baja"].includes(tarea.prioridad)
            ) {
                huboCambios = true;
            }

            return tareaActualizada;
        });

        if (huboCambios) {
            guardarTareas(tareas);
        }

        return tareas;
    } catch (error) {
        console.error("Error al cargar tareas:", error);
        return [];
    }
}

function guardarTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function obtenerRecordatorios() {
    try {
        const datos = JSON.parse(
            localStorage.getItem("recordatorios")
        ) || [];

        let huboCambios = false;

        const recordatorios = datos.map(function(recordatorio) {
            if (!recordatorio.id) {
                huboCambios = true;
            }

            return {
                id: recordatorio.id || generarId(),
                texto: recordatorio.texto || "",
                fecha: recordatorio.fecha || ""
            };
        });

        if (huboCambios) {
            localStorage.setItem(
                "recordatorios",
                JSON.stringify(recordatorios)
            );
        }

        return recordatorios;
    } catch (error) {
        console.error("Error al cargar recordatorios:", error);
        return [];
    }
}

function agregarTarea() {
    const input = document.getElementById("tarea");
    const selectorPrioridad = document.getElementById("prioridad-tarea");

    if (!input) return;

    const texto = input.value.trim();
    const prioridad = selectorPrioridad
        ? selectorPrioridad.value
        : "media";

    if (!texto) {
        alert("Escribe una tarea primero.");
        return;
    }

    const tareas = obtenerTareas();

    tareas.push({
        id: generarId(),
        texto: texto,
        completada: false,
        prioridad: prioridad
    });

    guardarTareas(tareas);

    input.value = "";

    if (selectorPrioridad) {
        selectorPrioridad.value = "media";
    }

    mostrarTareas();
    actualizarDashboard();
}


function mostrarTareas() {
    const lista = document.getElementById("lista-tareas");

    if (!lista) return;

    lista.replaceChildren();

    const tareas = obtenerTareas();
    const filtro = document.getElementById("filtro-tareas");
    const filtroActual = filtro ? filtro.value : "todas";

    const tareasFiltradas = tareas.filter(function(tarea) {
        if (filtroActual === "pendientes") {
            return !tarea.completada;
        }

        if (filtroActual === "completadas") {
            return tarea.completada;
        }

        return true;
    });

    const ordenPrioridad = {
        alta: 1,
        media: 2,
        baja: 3
    };

    tareasFiltradas.sort(function(a, b) {
        if (a.completada !== b.completada) {
            return Number(a.completada) - Number(b.completada);
        }

        return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
    });

    if (tareasFiltradas.length === 0) {
        const elemento = document.createElement("li");
        elemento.className = "task-empty";

        elemento.textContent = tareas.length === 0
            ? "Todavía no tienes tareas. ¡Agrega la primera!"
            : "No hay tareas en esta categoría.";

        lista.appendChild(elemento);
    }

    tareasFiltradas.forEach(function(tarea) {
        const elemento = document.createElement("li");
        const contenido = document.createElement("div");
        const casilla = document.createElement("input");
        const detalles = document.createElement("div");
        const texto = document.createElement("span");
        const prioridad = document.createElement("span");
        const acciones = document.createElement("div");
        const botonEditar = document.createElement("button");
        const botonEliminar = document.createElement("button");

        elemento.className = "task-item";
        elemento.classList.add("priority-" + tarea.prioridad);

        if (tarea.completada) {
            elemento.classList.add("task-completed");
        }

        contenido.className = "task-content";
        detalles.className = "task-details";
        acciones.className = "task-actions";

        casilla.type = "checkbox";
        casilla.className = "task-checkbox";
        casilla.checked = tarea.completada;

        casilla.addEventListener("change", function() {
            alternarTarea(tarea.id);
        });

        texto.className = "task-text";
        texto.textContent = tarea.texto;

        prioridad.className = "task-priority";
        prioridad.textContent = "Prioridad " + tarea.prioridad;

        botonEditar.type = "button";
        botonEditar.className = "task-edit";
        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", function() {
            editarTarea(tarea.id);
        });

        botonEliminar.type = "button";
        botonEliminar.className = "task-delete";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function() {
            eliminarTarea(tarea.id);
        });

        detalles.append(texto, prioridad);
        contenido.append(casilla, detalles);
        acciones.append(botonEditar, botonEliminar);
        elemento.append(contenido, acciones);

        lista.appendChild(elemento);
    });

    const pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    }).length;

    const completadas = tareas.length - pendientes;

    const resumen = document.createElement("li");
    resumen.className = "task-progress-text";
    resumen.textContent = pendientes + " pendientes · " +
        completadas + " completadas";

    lista.appendChild(resumen);

    actualizarDashboard();
}

function editarTarea(id) {
    const tareas = obtenerTareas();

    const tarea = tareas.find(function(item) {
        return item.id === id;
    });

    if (!tarea) return;

    const nuevoTexto = prompt("Edita el nombre de tu tarea:", tarea.texto);

    if (nuevoTexto === null) return;

    if (!nuevoTexto.trim()) {
        alert("El nombre de la tarea no puede estar vacío.");
        return;
    }

    tarea.texto = nuevoTexto.trim();

    guardarTareas(tareas);
    mostrarTareas();
    actualizarDashboard();
}


function alternarTarea(id) {
    const tareas = obtenerTareas();

    const tarea = tareas.find(function(item) {
        return item.id === id;
    });

    if (!tarea) return;

    tarea.completada = !tarea.completada;

    guardarTareas(tareas);
    mostrarTareas();
    actualizarDashboard();
}

function eliminarTarea(id) {
    const tareas = obtenerTareas();

    const tareasActualizadas = tareas.filter(function(tarea) {
        return tarea.id !== id;
    });

    if (tareasActualizadas.length === tareas.length) return;

    guardarTareas(tareasActualizadas);
    mostrarTareas();
    actualizarDashboard();
}

function agregarRecordatorio() {
    const inputTexto = document.getElementById("recordatorio");
    const inputFecha = document.getElementById("fecha");

    if (!inputTexto || !inputFecha) {
        alert("No se encontró el formulario de recordatorios.");
        return;
    }

    const texto = inputTexto.value.trim();
    const fecha = inputFecha.value;

    if (!texto || !fecha) {
        alert("Completa la descripción y la fecha del recordatorio.");
        return;
    }

    const recordatorios = obtenerRecordatorios();

    recordatorios.push({
        id: generarId(),
        texto: texto,
        fecha: fecha
    });

    localStorage.setItem(
        "recordatorios",
        JSON.stringify(recordatorios)
    );

    inputTexto.value = "";
    inputFecha.value = "";

    mostrarRecordatorios();
    actualizarDashboard();
}

function mostrarRecordatorios() {
    const lista = document.getElementById("lista-recordatorios");

    if (!lista) return;

    lista.replaceChildren();

    const recordatorios = obtenerRecordatorios();

    recordatorios.sort(function(a, b) {
        return a.fecha.localeCompare(b.fecha);
    });

    if (recordatorios.length === 0) {
        const elemento = document.createElement("li");
        elemento.className = "reminder-empty";
        elemento.textContent =
            "No tienes recordatorios pendientes. ¡Todo al día!";

        lista.appendChild(elemento);
        actualizarDashboard();
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    recordatorios.forEach(function(recordatorio) {
        const elemento = document.createElement("li");
        const contenido = document.createElement("div");
        const texto = document.createElement("span");
        const fecha = document.createElement("small");
        const boton = document.createElement("button");

        elemento.className = "reminder-item";
        contenido.className = "reminder-content";

        texto.className = "reminder-text";
        texto.textContent =
            recordatorio.texto || "Recordatorio sin descripción";

        if (recordatorio.fecha) {
            const partes = recordatorio.fecha.split("-").map(Number);

            const fechaRecordatorio = new Date(
                partes[0],
                partes[1] - 1,
                partes[2]
            );

            fecha.className = "reminder-date";
            fecha.textContent = "📅 " +
                fechaRecordatorio.toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

            if (fechaRecordatorio < hoy) {
                elemento.classList.add("reminder-overdue");
                fecha.textContent = "⚠️ Vencido · " + fecha.textContent;
            } else if (fechaRecordatorio.getTime() === hoy.getTime()) {
                elemento.classList.add("reminder-today");
                fecha.textContent = "📌 Hoy · " + fecha.textContent;
            } else {
                elemento.classList.add("reminder-upcoming");
            }
        } else {
            fecha.className = "reminder-date";
            fecha.textContent = "Sin fecha definida";
        }

        boton.type = "button";
        boton.className = "task-delete";
        boton.textContent = "Eliminar";

        boton.addEventListener("click", function() {
            eliminarRecordatorioPorTexto(recordatorio.id);
        });

        contenido.append(texto, fecha);
        elemento.append(contenido, boton);
        lista.appendChild(elemento);
    });

    actualizarDashboard();
}

function eliminarRecordatorioPorTexto(id) {
    const recordatorios = obtenerRecordatorios();

    const actualizados = recordatorios.filter(function(item) {
        return item.id !== id;
    });

    if (actualizados.length === recordatorios.length) return;

    localStorage.setItem(
        "recordatorios",
        JSON.stringify(actualizados)
    );

    mostrarRecordatorios();
    actualizarDashboard();
}

function eliminarRecordatorio(indice) {
    const recordatorios = obtenerRecordatorios();

    if (indice < 0 || indice >= recordatorios.length) return;

    recordatorios.splice(indice, 1);

    localStorage.setItem(
        "recordatorios",
        JSON.stringify(recordatorios)
    );

    mostrarRecordatorios();
    actualizarDashboard();
}

function actualizarDashboard() {
    const tareas = obtenerTareas();
    const recordatorios = obtenerRecordatorios();

    const pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    }).length;

    const completadas = tareas.length - pendientes;

    const contadorTareas = document.getElementById("contador-tareas");
    const contadorRecordatorios = document.getElementById("contador-recordatorios");
    const totalTareas = document.getElementById("total-tareas");
    const totalRecordatorios = document.getElementById("total-recordatorios");

    if (contadorTareas) {
        contadorTareas.textContent = pendientes + " tareas pendientes · " +
            completadas + " completadas";
    }

    if (contadorRecordatorios) {
        contadorRecordatorios.textContent =
            "Tienes " + recordatorios.length + " recordatorios";
    }

    if (totalTareas) {
        totalTareas.textContent = tareas.length;
    }

    if (totalRecordatorios) {
        totalRecordatorios.textContent = recordatorios.length;
    }
}

window.addEventListener("load", function() {
    mostrarTareas();
    mostrarRecordatorios();
    actualizarDashboard();
});
