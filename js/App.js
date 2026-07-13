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


let texto = mensaje.toLowerCase();


if(texto.includes("hola")){


    chat.innerHTML += 
    "<p>Nexia: Hola 👋 soy Nexia. Estoy listo para ayudarte.</p>";


}


else if(texto.includes("organizar") || texto.includes("día")){


    chat.innerHTML += 
    "<p>Nexia: Claro 🤖 puedo ayudarte a organizar tus tareas y actividades.</p>";


}


else if(texto.includes("recordatorio") || texto.includes("recordar")){


    chat.innerHTML += 
    "<p>Nexia: Puedo ayudarte a crear recordatorios para fechas importantes 🔔.</p>";


}


else if(texto.includes("documento") || texto.includes("archivo")){


    chat.innerHTML += 
    "<p>Nexia: Puedo ayudarte a organizar información y documentos importantes 📄.</p>";


}


else{


    chat.innerHTML += 
    "<p>Nexia: Todavía estoy aprendiendo, pero cada día soy más inteligente 🤖.</p>";

}


    document.getElementById("mensaje").value="";

}

function agregarTarea(){


    let tarea = document.getElementById("tarea").value;


    if(tarea === ""){

        alert("Escribe una tarea primero");

        return;

    }


    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


    tareas.push(tarea);


    localStorage.setItem("tareas", JSON.stringify(tareas));


    mostrarTareas();


    document.getElementById("tarea").value="";


}




function mostrarTareas(){


    let lista = document.getElementById("lista-tareas");


    lista.innerHTML="";


    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


    tareas.forEach(function(tarea){


        let nuevaTarea = document.createElement("li");


        nuevaTarea.textContent = "✅ " + tarea;


        lista.appendChild(nuevaTarea);


    });


}



window.onload = mostrarTareas;