
console.log("Nexia iniciado correctamente 🤖");

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

        return datos.map(function(tarea) {
            if (typeof tarea === "string") {
                return {
                    texto: tarea,
                    completada: false
                };
            }

            return {
                texto: tarea.texto || "",
                completada: Boolean(tarea.completada)
            };
        });
    } catch (error) {
        return [];
    }
}

function guardarTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function obtenerRecordatorios() {
    try {
        return JSON.parse(localStorage.getItem("recordatorios")) || [];
    } catch (error) {
        return [];
    }
}

function agregarTarea() {
    const input = document.getElementById("tarea");

    if (!input) return;

    const texto = input.value.trim();

    if (!texto) {
        alert("Escribe una tarea primero.");
        return;
    }

    const tareas = obtenerTareas();

    tareas.push({
        texto: texto,
        completada: false
    });

    guardarTareas(tareas);
    input.value = "";

    mostrarTareas();
    actualizarDashboard();
}

function mostrarTareas() {
    const lista = document.getElementById("lista-tareas");

    if (!lista) return;

    lista.replaceChildren();

    const tareas = obtenerTareas();
    const pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    }).length;

    if (tareas.length === 0) {
        const elemento = document.createElement("li");
        elemento.className = "task-empty";
        elemento.textContent = "Todavía no tienes tareas. ¡Agrega la primera!";
        lista.appendChild(elemento);
        actualizarDashboard();
        return;
    }

    tareas.forEach(function(tarea, indice) {
        const elemento = document.createElement("li");
        const contenido = document.createElement("div");
        const casilla = document.createElement("input");
        const texto = document.createElement("span");
        const boton = document.createElement("button");

        elemento.className = "task-item";

        if (tarea.completada) {
            elemento.classList.add("task-completed");
        }

        contenido.className = "task-content";

        casilla.type = "checkbox";
        casilla.className = "task-checkbox";
        casilla.checked = tarea.completada;
        casilla.setAttribute("aria-label", "Marcar como completada: " + tarea.texto);

        casilla.addEventListener("change", function() {
            alternarTarea(indice);
        });

        texto.className = "task-text";
        texto.textContent = tarea.texto;

        boton.type = "button";
        boton.className = "task-delete";
        boton.textContent = "Eliminar";
        boton.addEventListener("click", function() {
            eliminarTarea(indice);
        });

        contenido.append(casilla, texto);
        elemento.append(contenido, boton);
        lista.appendChild(elemento);
    });

    const resumen = document.createElement("p");
    resumen.className = "task-progress-text";
    resumen.textContent = pendientes + " pendientes · " +
        (tareas.length - pendientes) + " completadas";

    lista.appendChild(resumen);

    actualizarDashboard();
}

function alternarTarea(indice) {
    const tareas = obtenerTareas();

    if (indice < 0 || indice >= tareas.length) return;

    tareas[indice].completada = !tareas[indice].completada;

    guardarTareas(tareas);
    mostrarTareas();
    actualizarDashboard();
}

function eliminarTarea(indice) {
    const tareas = obtenerTareas();

    if (indice < 0 || indice >= tareas.length) return;

    tareas.splice(indice, 1);

    guardarTareas(tareas);
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
        texto: texto,
        fecha: fecha
    });

    localStorage.setItem("recordatorios", JSON.stringify(recordatorios));

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

    if (recordatorios.length === 0) {
        const elemento = document.createElement("li");
        elemento.textContent = "Todavía no tienes recordatorios guardados.";
        lista.appendChild(elemento);
        actualizarDashboard();
        return;
    }

    recordatorios.forEach(function(recordatorio, indice) {
        const elemento = document.createElement("li");
        const texto = document.createElement("span");
        const boton = document.createElement("button");

        elemento.className = "reminder-item";

        texto.textContent = "🔔 " + recordatorio.texto +
            " · 📅 " + (recordatorio.fecha || "Sin fecha");

        boton.type = "button";
        boton.className = "task-delete";
        boton.textContent = "Eliminar";

        boton.addEventListener("click", function() {
            eliminarRecordatorio(indice);
        });

        elemento.append(texto, boton);
        lista.appendChild(elemento);
    });

    actualizarDashboard();
}

function eliminarRecordatorio(indice) {
    const recordatorios = obtenerRecordatorios();

    if (indice < 0 || indice >= recordatorios.length) return;

    recordatorios.splice(indice, 1);

    localStorage.setItem("recordatorios", JSON.stringify(recordatorios));

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
        contadorRecordatorios.textContent = "Tienes " +
            recordatorios.length + " recordatorios";
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
