
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function obtenerTareasChat() {
    try {
        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

        return tareas.map(function(tarea) {
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

function obtenerRecordatoriosChat() {
    try {
        return JSON.parse(localStorage.getItem("recordatorios")) || [];
    } catch (error) {
        return [];
    }
}

function agregarMensajeChat(texto, tipo) {
    const chat = document.getElementById("chat-box");

    if (!chat) return;

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje " + tipo;
    mensaje.textContent = texto;

    chat.appendChild(mensaje);
    chat.scrollTop = chat.scrollHeight;
}

function actualizarDatosChat() {
    if (typeof mostrarTareas === "function") {
        mostrarTareas();
    }

    if (typeof mostrarRecordatorios === "function") {
        mostrarRecordatorios();
    }

    if (typeof actualizarDashboard === "function") {
        actualizarDashboard();
    }
}

function crearTareaDesdeChat(texto) {
    if (!texto) {
        return "Escribe el nombre de la tarea. Ejemplo: Crear tarea: estudiar programación.";
    }

    const tareas = obtenerTareasChat();

    tareas.push({
        texto: texto,
        completada: false
    });

    localStorage.setItem("tareas", JSON.stringify(tareas));
    actualizarDatosChat();

    return "✅ Tarea creada correctamente: " + texto;
}

function crearRecordatorioDesdeChat(texto) {
    if (!texto) {
        return "Escribe qué necesitas recordar. Ejemplo: Crear recordatorio: pagar internet.";
    }

    let descripcion = texto;
    let fecha = "";

    const coincidencia = texto.match(/\|\s*(\d{4}-\d{2}-\d{2})\s*$/);

    if (coincidencia) {
        fecha = coincidencia[1];
        descripcion = texto.substring(0, coincidencia.index).trim();

        const partes = fecha.split("-").map(Number);
        const fechaValidada = new Date(partes[0], partes[1] - 1, partes[2]);

        if (
            fechaValidada.getFullYear() !== partes[0] ||
            fechaValidada.getMonth() !== partes[1] - 1 ||
            fechaValidada.getDate() !== partes[2]
        ) {
            return "La fecha no es válida. Usa el formato AAAA-MM-DD.";
        }
    }

    if (!descripcion) {
        return "Escribe una descripción para el recordatorio.";
    }

    const recordatorios = obtenerRecordatoriosChat();

    recordatorios.push({
        texto: descripcion,
        fecha: fecha
    });

    localStorage.setItem("recordatorios", JSON.stringify(recordatorios));
    actualizarDatosChat();

    if (fecha) {
        return "🔔 Recordatorio guardado: " + descripcion + ". Fecha: " + fecha + ".";
    }

    return "🔔 Recordatorio guardado: " + descripcion +
        ". Puedes añadir una fecha desde la sección Mis recordatorios.";
}

function consultarTareas() {
    const tareas = obtenerTareasChat();

    if (tareas.length === 0) {
        return "📋 Todavía no tienes tareas. Puedes crear una escribiendo: Crear tarea: estudiar.";
    }

    const pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    });

    if (pendientes.length === 0) {
        return "🎉 ¡Excelente! No tienes tareas pendientes. Has completado todas tus tareas registradas.";
    }

    return "📋 Estas son tus tareas pendientes:\n" +
        pendientes.map(function(tarea, indice) {
            return (indice + 1) + ". " + tarea.texto;
        }).join("\n");
}

function consultarCompletadas() {
    const tareas = obtenerTareasChat();

    const completadas = tareas.filter(function(tarea) {
        return tarea.completada;
    });

    if (completadas.length === 0) {
        return "Todavía no has marcado tareas como completadas. Puedes hacerlo usando la casilla al lado de cada tarea.";
    }

    return "✅ Estas son tus tareas completadas:\n" +
        completadas.map(function(tarea, indice) {
            return (indice + 1) + ". " + tarea.texto;
        }).join("\n");
}

function consultarRecordatorios() {
    const recordatorios = obtenerRecordatoriosChat();

    if (recordatorios.length === 0) {
        return "🔔 No tienes recordatorios guardados. Prueba: Crear recordatorio: pagar internet.";
    }

    const ordenados = recordatorios.slice().sort(function(a, b) {
        return (a.fecha || "9999-12-31").localeCompare(
            b.fecha || "9999-12-31"
        );
    });

    return "🔔 Tus recordatorios son:\n" +
        ordenados.map(function(recordatorio, indice) {
            return (indice + 1) + ". " + recordatorio.texto +
                " — " + (recordatorio.fecha || "Sin fecha definida");
        }).join("\n");
}

function organizarDia() {
    const tareas = obtenerTareasChat();
    const recordatorios = obtenerRecordatoriosChat();

    const pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const recordatoriosHoy = recordatorios.filter(function(recordatorio) {
        return recordatorio.fecha ===
            [
                hoy.getFullYear(),
                String(hoy.getMonth() + 1).padStart(2, "0"),
                String(hoy.getDate()).padStart(2, "0")
            ].join("-");
    });

    let respuesta = "🗓️ Vamos a organizar tu día.\n\n";

    if (pendientes.length > 0) {
        respuesta += "📋 Tareas pendientes:\n";

        respuesta += pendientes.slice(0, 5).map(function(tarea, indice) {
            return (indice + 1) + ". " + tarea.texto;
        }).join("\n");

        if (pendientes.length > 5) {
            respuesta += "\nY " + (pendientes.length - 5) +
                " tareas más.";
        }
    } else {
        respuesta += "✅ No tienes tareas pendientes registradas.";
    }

    respuesta += "\n\n🔔 Recordatorios para hoy: " + recordatoriosHoy.length + ".";

    respuesta += "\n\nMi sugerencia: empieza por la tarea más importante y divide las actividades grandes en pasos pequeños.";

    return respuesta;
}

function responderNexia(textoOriginal) {
    const texto = normalizarTexto(textoOriginal);

    const comandoTarea = textoOriginal.match(
        /^\s*(?:crear|agregar|anadir|anade|nueva)\s+tareas?\s*:\s*([\s\S]+)$/i
    );

    if (comandoTarea) {
        return crearTareaDesdeChat(comandoTarea[1].trim());
    }

    const comandoRecordatorio = textoOriginal.match(
        /^\s*(?:crear|agregar|anadir|anade|nuevo|nueva)\s+recordatorios?\s*:\s*([\s\S]+)$/i
    );

    if (comandoRecordatorio) {
        return crearRecordatorioDesdeChat(comandoRecordatorio[1].trim());
    }

    if (
        texto.includes("que puedes hacer") ||
        texto.includes("ayuda") ||
        texto.includes("funciones") ||
        texto === "comandos"
    ) {
        return "🤖 Estas son mis funciones actuales:\n\n" +
            "📋 Crear tarea: estudiar programación\n" +
            "🔔 Crear recordatorio: pagar internet | 2026-11-05\n" +
            "📝 Consultar tareas pendientes\n" +
            "✅ Consultar tareas completadas\n" +
            "📅 Consultar recordatorios\n" +
            "🗓️ Organizar mi día\n\n" +
            "Para añadir una fecha desde el chat, utiliza el formato AAAA-MM-DD después de la barra vertical.";
    }

    if (
        texto.includes("tareas completadas") ||
        texto.includes("tareas terminadas") ||
        texto.includes("que he completado") ||
        texto.includes("que complete")
    ) {
        return consultarCompletadas();
    }

    if (
        texto.includes("recordatorios") ||
        texto.includes("que debo recordar") ||
        texto.includes("que tengo que recordar")
    ) {
        return consultarRecordatorios();
    }

    if (
        texto.includes("organizar mi dia") ||
        texto.includes("organiza mi dia") ||
        texto.includes("organizar el dia") ||
        texto.includes("organizar mi tiempo") ||
        texto.includes("planificar mi dia")
    ) {
        return organizarDia();
    }

    if (
        texto.includes("tareas pendientes") ||
        texto.includes("que tengo pendiente") ||
        texto.includes("que tengo por hacer") ||
        texto.includes("mis tareas") ||
        texto === "tareas" ||
        texto.includes("consultar tareas")
    ) {
        return consultarTareas();
    }

    if (
        texto === "hola" ||
        texto.startsWith("hola ") ||
        texto.includes("buenos dias") ||
        texto.includes("buenas tardes") ||
        texto.includes("buenas noches") ||
        texto === "que mas"
    ) {
        return "¡Hola! 👋 Soy Nexia, tu asistente virtual. Puedo ayudarte a gestionar tus tareas y recordatorios. ¿Qué necesitas hacer hoy?";
    }

    if (texto.includes("como estas")) {
        return "¡Funcionando correctamente! 🤖 Estoy listo para ayudarte con tu organización.";
    }

    if (texto.includes("gracias")) {
        return "¡Con mucho gusto! 😊 Sigamos organizando tus pendientes.";
    }

    if (
        texto.includes("documento") ||
        texto.includes("archivo") ||
        texto.includes("formulario") ||
        texto.includes("tramite")
    ) {
        return "📄 Puedo ayudarte a organizar tus pendientes relacionados con documentos y trámites. Puedes registrar cada actividad con el comando Crear tarea: seguido de su descripción.";
    }

    return "🤖 No tengo una respuesta específica para eso todavía. Escribe «ayuda» para consultar mis comandos o dime si quieres crear una tarea, consultar pendientes u organizar tu día.";
}

function enviarMensaje() {
    const input = document.getElementById("mensaje");

    if (!input) return;

    const texto = input.value.trim();

    if (!texto) return;

    agregarMensajeChat(texto, "user");

    input.value = "";

    const respuesta = responderNexia(texto);

    agregarMensajeChat(respuesta, "bot");
}

window.addEventListener("load", function() {
    const input = document.getElementById("mensaje");

    if (input) {
        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                enviarMensaje();
            }
        });
    }
});
