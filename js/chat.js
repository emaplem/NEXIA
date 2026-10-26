
function enviarMensaje() {
    const input = document.getElementById("mensaje");
    const chat = document.getElementById("chat-box");

    if (!input || !chat) return;

    const texto = input.value.trim();

    if (!texto) return;

    const mensaje = texto.toLowerCase();

    const mensajeUsuario = document.createElement("div");
    mensajeUsuario.className = "mensaje user";
    mensajeUsuario.textContent = texto;
    chat.appendChild(mensajeUsuario);

    input.value = "";

    const respuesta = document.createElement("div");
    respuesta.className = "mensaje bot";

    if (
        mensaje.startsWith("crear tarea:") ||
        mensaje.startsWith("agregar tarea:")
    ) {
        const nombreTarea = texto.substring(texto.indexOf(":") + 1).trim();

        if (!nombreTarea) {
            respuesta.textContent = "Escribe el nombre de la tarea después de los dos puntos.";
        } else {
            const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
            tareas.push(nombreTarea);
            localStorage.setItem("tareas", JSON.stringify(tareas));

            if (typeof mostrarTareas === "function") mostrarTareas();
            if (typeof actualizarDashboard === "function") actualizarDashboard();

            respuesta.textContent = "✅ ¡Listo! He agregado la tarea: " + nombreTarea;
        }

    } else if (
        mensaje.startsWith("crear recordatorio:") ||
        mensaje.startsWith("crear recordatoria:") ||
        mensaje.startsWith("agregar recordatorio:")
    ) {
        const textoRecordatorio = texto.substring(texto.indexOf(":") + 1).trim();

        if (!textoRecordatorio) {
            respuesta.textContent = "Escribe qué necesitas recordar después de los dos puntos.";
        } else {
            const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];

            recordatorios.push({
                texto: textoRecordatorio,
                fecha: "Sin fecha"
            });

            localStorage.setItem("recordatorios", JSON.stringify(recordatorios));

            if (typeof mostrarRecordatorios === "function") mostrarRecordatorios();
            if (typeof actualizarDashboard === "function") actualizarDashboard();

            respuesta.textContent = "🔔 ¡Recordatorio guardado!: " + textoRecordatorio;
        }

    } else if (
        mensaje.includes("hola") ||
        mensaje.includes("buenos días") ||
        mensaje.includes("buenas tardes") ||
        mensaje.includes("buenas noches") ||
        mensaje.includes("qué más")
    ) {
        respuesta.textContent = "¡Hola! 👋 Soy Nexia, tu asistente virtual. Estoy aquí para ayudarte a organizar tu día. ¿Qué necesitas hacer hoy?";

    } else if (
        mensaje.includes("qué puedes hacer") ||
        mensaje.includes("que puedes hacer") ||
        mensaje.includes("ayuda") ||
        mensaje.includes("funciones")
    ) {
        respuesta.textContent = "Puedo ayudarte con estas funciones: 📋 crear tareas, 🔔 guardar recordatorios y 📊 consultar el resumen de tus pendientes. Escribe 'Crear tarea: estudiar' o 'Crear recordatorio: pagar internet' para comenzar.";

    } else if (
        mensaje.includes("cómo estás") ||
        mensaje.includes("como estas")
    ) {
        respuesta.textContent = "¡Funcionando al 100 %! 🤖 Estoy listo para ayudarte a organizar tus pendientes. ¿Qué hacemos primero?";

    } else if (
        mensaje.includes("gracias")
    ) {
        respuesta.textContent = "¡Con mucho gusto! 😊 Estoy aquí para ayudarte a organizar tus actividades.";

    } else if (
        mensaje.includes("tareas") ||
        mensaje.includes("mis tareas")
    ) {
        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

        if (tareas.length === 0) {
            respuesta.textContent = "📋 Todavía no tienes tareas guardadas. Puedes crear una escribiendo: Crear tarea: estudiar.";
        } else {
            respuesta.textContent = "📋 Tienes " + tareas.length + " tarea(s): " + tareas.join(", ");
        }

    } else if (
        mensaje.includes("recordatorios") ||
        mensaje.includes("mis recordatorios")
    ) {
        const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];

        if (recordatorios.length === 0) {
            respuesta.textContent = "🔔 Todavía no tienes recordatorios. Crea uno escribiendo: Crear recordatorio: pagar internet.";
        } else {
            respuesta.textContent = "🔔 Tus recordatorios son: " + recordatorios.map(function(recordatorio) {
                return recordatorio.texto;
            }).join(", ");
        }

    } else if (
        mensaje.includes("organizar mi día") ||
        mensaje.includes("organizar mi dia") ||
        mensaje.includes("organizar mi tiempo")
    ) {
        respuesta.textContent = "🗓️ ¡Vamos a organizar tu día! Primero, anota tus tareas más importantes usando 'Crear tarea: seguido de la actividad'. Después, guarda cualquier pendiente con 'Crear recordatorio: seguido de lo que necesitas recordar'.";

    } else {
        respuesta.textContent = "🤖 Entiendo lo que me dices. Por ahora estoy aprendiendo. Puedes pedirme ayuda con tareas, recordatorios o escribir '¿Qué puedes hacer?' para conocer mis funciones.";
    }

    chat.appendChild(respuesta);
    chat.scrollTop = chat.scrollHeight;
}
