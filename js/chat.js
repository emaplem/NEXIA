function enviarMensaje(){

    let input = document.getElementById("mensaje");
    let chat = document.getElementById("chat-box");

    let texto = input.value.trim();

    if(texto === ""){
        return;
    }

    let mensajeUsuario = document.createElement("div");

    mensajeUsuario.className = "mensaje user";

    mensajeUsuario.textContent = texto;

    chat.appendChild(mensajeUsuario);

    input.value = "";

    let respuesta = document.createElement("div");

    respuesta.className = "mensaje bot";

    if(texto.toLowerCase().includes("tarea")){

        respuesta.textContent =
        "📋 Puedo ayudarte a organizar tus tareas.";

    }else if(texto.toLowerCase().includes("recordatorio")){

        respuesta.textContent =
        "🔔 También puedo guardar recordatorios importantes.";

    }else{

        respuesta.textContent =
        "🤖 Entendido. Estoy aprendiendo y pronto seré mucho más inteligente.";

    }

    chat.appendChild(respuesta);

    chat.scrollTop = chat.scrollHeight;

}