
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

    recordatorios.sort(function(a, b) {
        const fechaA = a.fecha || "9999-12-31";
        const fechaB = b.fecha || "9999-12-31";

        return fechaA.localeCompare(fechaB);
    });

    if (recordatorios.length === 0) {
        const elemento = document.createElement("li");
        elemento.className = "reminder-empty";
        elemento.textContent = "No tienes recordatorios pendientes. ¡Todo al día!";
        lista.appendChild(elemento);
        actualizarDashboard();
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    recordatorios.forEach(function(recordatorio, indice) {
        const elemento = document.createElement("li");
        const contenido = document.createElement("div");
        const texto = document.createElement("span");
        const fecha = document.createElement("small");
        const boton = document.createElement("button");

        elemento.className = "reminder-item";
        contenido.className = "reminder-content";

        const fechaTexto = recordatorio.fecha || "";

        texto.className = "reminder-text";
        texto.textContent = recordatorio.texto || "Recordatorio sin descripción";

        if (fechaTexto) {
            const partes = fechaTexto.split("-").map(Number);
            const fechaRecordatorio = new Date(
                partes[0],
                partes[1] - 1,
                partes[2]
            );

            fecha.className = "reminder-date";
            fecha.textContent = "📅 " + fechaRecordatorio.toLocaleDateString("es-CO", {
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
            eliminarRecordatorioPorTexto(recordatorio);
        });

        contenido.append(texto, fecha);
        elemento.append(contenido, boton);
        lista.appendChild(elemento);
    });

    actualizarDashboard();
}

function eliminarRecordatorioPorTexto(recordatorio) {
    const recordatorios = obtenerRecordatorios();
    const indice = recordatorios.indexOf(recordatorio);

    if (indice === -1) {
        const encontrado = recordatorios.findIndex(function(item) {
            return item.texto === recordatorio.texto &&
                item.fecha === recordatorio.fecha;
        });

        if (encontrado === -1) return;

        recordatorios.splice(encontrado, 1);
    } else {
        recordatorios.splice(indice, 1);
    }

    localStorage.setItem("recordatorios", JSON.stringify(recordatorios));

    mostrarRecordatorios();
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
