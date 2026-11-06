
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function generarIdChat() {
    if (typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return "nexia-" + Date.now() + "-" +
        Math.random().toString(36).slice(2, 10);
}

function obtenerTareasChat() {
    try {
        const datos = JSON.parse(localStorage.getItem("tareas")) || [];

        return datos.map(function(tarea) {
            if (typeof tarea === "string") {
                return {
                    id: generarIdChat(),
                    texto: tarea,
                    completada: false,
                    prioridad: "media",
                    categoria: "otros"
                };
            }

            return {
                id: tarea.id || generarIdChat(),
                texto: tarea.texto || "",
                completada: Boolean(tarea.completada),
                prioridad: ["alta", "media", "baja"].includes(tarea.prioridad)
                    ? tarea.prioridad
                    : "media",
                categoria: ["personal", "estudio", "trabajo", "otros"].includes(tarea.categoria)
                    ? tarea.categoria
                    : "otros"
            };
        });
    } catch (error) {
        console.error("Error al leer tareas:", error);
        return [];
    }
}

function guardarTareasChat(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function obtenerRecordatoriosChat() {
    try {
        return JSON.parse(localStorage.getItem("recordatorios")) || [];
    } catch (error) {
        console.error("Error al leer recordatorios:", error);
        return [];
    }
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

function guardarHistorialChat() {
    const historial = JSON.parse(
        localStorage.getItem("historialChat")
    ) || [];

    localStorage.setItem("historialChat", JSON.stringify(historial));
}

function agregarMensajeChat(texto, tipo) {
    const chat = document.getElementById("chat-box");

    if (!chat) return;

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje " + tipo;
    mensaje.textContent = texto;

    chat.appendChild(mensaje);
    chat.scrollTop = chat.scrollHeight;

    const historial = JSON.parse(
        localStorage.getItem("historialChat")
    ) || [];

    historial.push({
        texto: texto,
        tipo: tipo,
        fecha: new Date().toISOString()
    });

    localStorage.setItem("historialChat", JSON.stringify(historial));
}

function cargarHistorialChat() {
    const chat = document.getElementById("chat-box");

    if (!chat) return;

    const historial = JSON.parse(
        localStorage.getItem("historialChat")
    ) || [];

    chat.innerHTML = "";

    historial.forEach(function(item) {
        const mensaje = document.createElement("div");

        mensaje.className = "mensaje " + item.tipo;
        mensaje.textContent = item.texto;

        chat.appendChild(mensaje);
    });

    chat.scrollTop = chat.scrollHeight;
}

function limpiarHistorialChat() {
    const confirmar = confirm(
        "¿Estás seguro de que deseas borrar todo el historial del chat?"
    );

    if (!confirmar) return;

    localStorage.removeItem("historialChat");

    const chat = document.getElementById("chat-box");

    if (chat) {
        chat.innerHTML = "";
    }

    agregarMensajeChat(
        "¡Hola! Soy Nexia. ¿En qué puedo ayudarte hoy? 🤖",
        "bot"
    );
}

function crearTareaDesdeChat(contenido) {
    if (!contenido.trim()) {
        return "Escribe una tarea. Ejemplo: Crear tarea: estudiar programación.";
    }

    let descripcion = contenido.trim();
    let prioridad = "media";
    let categoria = "otros";

    const partes = descripcion.split("|");
    descripcion = partes.shift().trim();

    partes.forEach(function(parte) {
        const opcion = normalizarTexto(parte);

        if (opcion.startsWith("prioridad:")) {
            prioridad = opcion.split(":")[1].trim();
        }

        if (opcion.startsWith("categoria:")) {
            categoria = opcion.split(":")[1].trim();
        }
    });

    if (!descripcion) {
        return "Escribe una descripción para la tarea.";
    }

    if (!["alta", "media", "baja"].includes(prioridad)) {
        return "La prioridad no es válida. Utiliza alta, media o baja.";
    }

    if (!["personal", "estudio", "trabajo", "otros"].includes(categoria)) {
        return "La categoría no es válida. Utiliza personal, estudio, trabajo u otros.";
    }

    const tareas = obtenerTareasChat();

    const nuevaTarea = {
        id: generarIdChat(),
        texto: descripcion,
        completada: false,
        prioridad: prioridad,
        categoria: categoria
    };

    tareas.push(nuevaTarea);
    guardarTareasChat(tareas);
    actualizarDatosChat();

    return "✅ ¡Tarea creada correctamente!\n\n" +
        "📝 " + descripcion + "\n" +
        "📌 Categoría: " + categoria + "\n" +
        "⚡ Prioridad: " + prioridad;
}

function crearRecordatorioDesdeChat(contenido) {
    if (!contenido.trim()) {
        return "Escribe qué necesitas recordar. Ejemplo: Crear recordatorio: pagar internet.";
    }

    let descripcion = contenido.trim();
    let fecha = "";

    const coincidencia = descripcion.match(
        /\|\s*(\d{4}-\d{2}-\d{2})\s*$/
    );

    if (coincidencia) {
        fecha = coincidencia[1];
        descripcion = descripcion.slice(0, coincidencia.index).trim();

        const partes = fecha.split("-").map(Number);
        const fechaValidada = new Date(
            partes[0],
            partes[1] - 1,
            partes[2]
        );

        const fechaCorrecta =
            fechaValidada.getFullYear() === partes[0] &&
            fechaValidada.getMonth() === partes[1] - 1 &&
            fechaValidada.getDate() === partes[2];

        if (!fechaCorrecta) {
            return "⚠️ Esa fecha no es válida. Usa el formato AAAA-MM-DD.";
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaValidada < hoy) {
            return "⚠️ Esa fecha ya pasó. Introduce una fecha de hoy o futura.";
        }
    }

    if (!descripcion) {
        return "Escribe una descripción para el recordatorio.";
    }

    const recordatorios = obtenerRecordatoriosChat();

    recordatorios.push({
        id: generarIdChat(),
        texto: descripcion,
        fecha: fecha
    });

    localStorage.setItem(
        "recordatorios",
        JSON.stringify(recordatorios)
    );

    actualizarDatosChat();

    return "🔔 ¡Recordatorio guardado!\n\n" +
        "📝 " + descripcion + "\n" +
        "📅 " + (fecha || "Sin fecha definida");
}

function consultarTareas(categoriaFiltro) {
    const tareas = obtenerTareasChat();

    let pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    });

    if (categoriaFiltro) {
        pendientes = pendientes.filter(function(tarea) {
            return tarea.categoria === categoriaFiltro;
        });
    }

    if (pendientes.length === 0) {
        return categoriaFiltro
            ? "📋 No tienes tareas pendientes en la categoría " + categoriaFiltro + "."
            : tareas.length === 0
                ? "📋 Todavía no tienes tareas. Prueba: Crear tarea: estudiar."
                : "🎉 ¡Excelente! No tienes tareas pendientes.";
    }

    return "📋 TUS TAREAS PENDIENTES\n\n" +
        pendientes.map(function(tarea, indice) {
            return (indice + 1) + ". " + tarea.texto +
                "\n   Categoría: " + tarea.categoria +
                " | Prioridad: " + tarea.prioridad;
        }).join("\n\n");
}

function consultarCompletadas() {
    const completadas = obtenerTareasChat().filter(function(tarea) {
        return tarea.completada;
    });

    if (completadas.length === 0) {
        return "Todavía no tienes tareas marcadas como completadas.";
    }

    return "✅ TUS TAREAS COMPLETADAS\n\n" +
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

    return "🔔 TUS RECORDATORIOS\n\n" +
        ordenados.map(function(recordatorio, indice) {
            return (indice + 1) + ". " +
                (recordatorio.texto || "Sin descripción") +
                "\n   Fecha: " + (recordatorio.fecha || "Sin fecha definida");
        }).join("\n\n");
}

function organizarDia() {
    const tareas = obtenerTareasChat();
    const recordatorios = obtenerRecordatoriosChat();

    const pendientes = tareas.filter(function(tarea) {
        return !tarea.completada;
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaHoy = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0")
    ].join("-");

    const recordatoriosHoy = recordatorios.filter(function(recordatorio) {
        return recordatorio.fecha === fechaHoy;
    });

    const vencidos = recordatorios.filter(function(recordatorio) {
        return recordatorio.fecha && recordatorio.fecha < fechaHoy;
    });

    const prioridadAlta = pendientes.filter(function(tarea) {
        return tarea.prioridad === "alta";
    });

    let respuesta = "🗓️ RESUMEN DE TU DÍA\n\n";

    respuesta += "📋 Tareas pendientes: " + pendientes.length + "\n";
    respuesta += "✅ Tareas completadas: " +
        (tareas.length - pendientes.length) + "\n";
    respuesta += "⚡ Tareas de prioridad alta: " +
        prioridadAlta.length + "\n";
    respuesta += "📌 Recordatorios para hoy: " +
        recordatoriosHoy.length + "\n";
    respuesta += "⚠️ Recordatorios vencidos: " +
        vencidos.length + "\n\n";

    if (pendientes.length > 0) {
        respuesta += "TUS PRÓXIMAS TAREAS\n";

        respuesta += pendientes.slice(0, 5).map(function(tarea, indice) {
            return (indice + 1) + ". " + tarea.texto +
                " (" + tarea.prioridad + ")";
        }).join("\n");
    } else {
        respuesta += "¡No tienes tareas pendientes registradas!";
    }

    respuesta += "\n\n💡 Consejo: empieza por una tarea importante y organiza las demás según su prioridad.";

    return respuesta;
}

function mostrarAyuda() {
    return "🤖 FUNCIONES DE NEXIA\n\n" +
        "📋 CREAR TAREAS\n" +
        "Crear tarea: estudiar programación\n\n" +
        "También puedes indicar categoría y prioridad:\n" +
        "Crear tarea: estudiar | categoría: estudio | prioridad: alta\n\n" +
        "Categorías: personal, estudio, trabajo y otros.\n" +
        "Prioridades: alta, media y baja.\n\n" +
        "🔔 RECORDATORIOS\n" +
        "Crear recordatorio: pagar internet | 2026-11-10\n\n" +
        "📚 CONSULTAS\n" +
        "Consultar mis tareas pendientes\n" +
        "Ver tareas completadas\n" +
        "Mostrar mis recordatorios\n" +
        "Ver mis tareas de estudio\n\n" +
        "🗓️ ORGANIZACIÓN\n" +
        "Organizar mi día";
}

function responderNexia(mensajeOriginal) {
    const texto = normalizarTexto(mensajeOriginal);

    const comandoTarea = mensajeOriginal.match(
        /^\s*(?:crear|agregar|añadir|anadir|nueva|nuevo)\s+tareas?\s*:\s*([\s\S]+)$/i
    );

    if (comandoTarea) {
        return crearTareaDesdeChat(comandoTarea[1]);
    }

    const comandoRecordatorio = mensajeOriginal.match(
        /^\s*(?:crear|agregar|añadir|anadir|nueva|nuevo)\s+recordatorios?\s*:\s*([\s\S]+)$/i
    );

    if (comandoRecordatorio) {
        return crearRecordatorioDesdeChat(comandoRecordatorio[1]);
    }

    if (
        texto === "ayuda" ||
        texto.includes("que puedes hacer") ||
        texto.includes("que sabes hacer") ||
        texto.includes("como puedes ayudarme") ||
        texto === "comandos"
    ) {
        return mostrarAyuda();
    }

    if (
        texto.includes("tareas completadas") ||
        texto.includes("tareas terminadas") ||
        texto.includes("que he completado") ||
        texto.includes("que complete") ||
        texto.includes("que ya hice")
    ) {
        return consultarCompletadas();
    }

    if (texto.includes("tareas de estudio") || texto.includes("tareas de estudiar")) {
        return consultarTareas("estudio");
    }

    if (texto.includes("tareas de trabajo")) {
        return consultarTareas("trabajo");
    }

    if (texto.includes("tareas personales") || texto.includes("tareas personales")) {
        return consultarTareas("personal");
    }

    if (texto.includes("tareas de otros") || texto.includes("otras tareas")) {
        return consultarTareas("otros");
    }

    if (
        texto.includes("recordatorio") ||
        texto.includes("que debo recordar") ||
        texto.includes("que tengo que recordar") ||
        texto.includes("mis avisos")
    ) {
        return consultarRecordatorios();
    }

    if (
        texto.includes("organizar mi dia") ||
        texto.includes("organiza mi dia") ||
        texto.includes("organizar el dia") ||
        texto.includes("planificar mi dia") ||
        texto.includes("resumen de mi dia") ||
        texto.includes("como va mi dia") ||
        texto.includes("que tengo para hoy")
    ) {
        return organizarDia();
    }

    if (
        texto.includes("tareas pendientes") ||
        texto.includes("que tengo pendiente") ||
        texto.includes("que tengo por hacer") ||
        texto.includes("que debo hacer") ||
        texto.includes("que tengo que hacer") ||
        texto.includes("mis actividades") ||
        texto.includes("mis tareas") ||
        texto === "tareas"
    ) {
        return consultarTareas();
    }

    if (
        texto === "hola" ||
        texto.startsWith("hola ") ||
        texto.startsWith("buenos dias") ||
        texto.startsWith("buenas tardes") ||
        texto.startsWith("buenas noches") ||
        texto === "que mas"
    ) {
        return "¡Hola! 👋 Soy Nexia. Estoy listo para ayudarte a organizar tus actividades. ¿Qué necesitas hacer hoy?";
    }

    if (
        texto.includes("como estas") ||
        texto.includes("estas funcionando")
    ) {
        return "¡Estoy funcionando correctamente! 🤖 ¿Qué actividad quieres organizar?";
    }

    if (texto.includes("gracias")) {
        return "¡Con mucho gusto! 😊 Estoy aquí para ayudarte a organizar mejor tu tiempo.";
    }

    if (
        texto.includes("documento") ||
        texto.includes("archivo") ||
        texto.includes("formulario") ||
        texto.includes("tramite") ||
        texto.includes("cita")
    ) {
        return "Puedo ayudarte a organizar esa actividad. Puedes convertirla en una tarea escribiendo: Crear tarea: reunir documentos para mi cita.";
    }

    if (
        texto.includes("estoy ocupado") ||
        texto.includes("tengo muchas cosas") ||
        texto.includes("no se por donde empezar") ||
        texto.includes("no se que hacer primero")
    ) {
        return "Podemos organizarlo paso a paso. Primero revisemos tus tareas pendientes y después priorizamos las más importantes. Escribe: Organizar mi día.";
    }

    if (
        texto.includes("quien eres") ||
        texto.includes("que eres")
    ) {
        return "Soy Nexia, tu asistente virtual de organización. Puedo ayudarte a administrar tareas, consultar recordatorios y planificar tus actividades.";
    }

    return "No he comprendido completamente tu solicitud. 🤔 Puedes explicármela de otra manera o escribir «ayuda» para conocer mis funciones.";
}

function enviarMensaje() {
    const input = document.getElementById("mensaje");

    if (!input) return;

    const mensaje = input.value.trim();

    if (!mensaje) return;

    agregarMensajeChat(mensaje, "user");
    input.value = "";

    const respuesta = responderNexia(mensaje);

    agregarMensajeChat(respuesta, "bot");
}

window.addEventListener("load", function() {
    cargarHistorialChat();

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
