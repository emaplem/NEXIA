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

   let mensaje = texto.toLowerCase();

if(mensaje.startsWith("crear tarea:")){

    let nombreTarea = texto.substring(13).trim();

    if(nombreTarea !== ""){

        let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

        tareas.push(nombreTarea);

        localStorage.setItem("tareas", JSON.stringify(tareas));

        try{
    if(typeof mostrarTareas === "function"){
        mostrarTareas();
    }

    if(typeof actualizarDashboard === "function"){
        actualizarDashboard();
    }
}catch(error){
    console.log(error);
}

        respuesta.textContent =
        "✅ He agregado la tarea: " + nombreTarea;

    }else{

        respuesta.textContent =
        "Escribe el nombre después de 'Crear tarea:'";

    }

}else if(mensaje.includes("recordatorio")){

    respuesta.textContent =
    "🔔 También puedo ayudarte con recordatorios.";

}else{

    respuesta.textContent =
    "🤖 Entendido. Estoy aprendiendo y cada vez puedo ayudarte mejor.";

}

    chat.appendChild(respuesta);

    chat.scrollTop = chat.scrollHeight;

}