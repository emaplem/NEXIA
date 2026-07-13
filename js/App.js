console.log("Nexia iniciado correctamente 🤖");


function iniciarNexia(){

    alert("Hola 👋 soy Nexia, tu asistente virtual. ¿En qué puedo ayudarte?");

}

function mostrarChat(){

    document.querySelector(".chat").scrollIntoView();

}



function enviarMensaje(){

    let mensaje = document.getElementById("mensaje").value;


    let chat = document.getElementById("chat-box");


    chat.innerHTML += 
    "<p>Usuario: " + mensaje + "</p>";


    if(mensaje.toLowerCase().includes("hola")){


        chat.innerHTML += 
        "<p>Nexia: Hola 👋 ¿Cómo puedo ayudarte?</p>";


    }

    else{


        chat.innerHTML += 
        "<p>Nexia: Estoy aprendiendo todavía 🤖, pero pronto podré ayudarte con muchas tareas.</p>";


    }


    document.getElementById("mensaje").value="";

}