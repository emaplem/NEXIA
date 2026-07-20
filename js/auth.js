function iniciarSesion(){

    let correo = document.getElementById("correo").value;

    let password = document.getElementById("password").value;

    if(correo === "" || password === ""){

        alert("Completa todos los campos.");

        return;

    }

    alert("¡Bienvenido a Nexia, " + correo + "!");

    window.location.href = "dashboard.html";

}

function registrarUsuario(){

    let nombre = document.getElementById("nombre").value;

    let correo = document.getElementById("correoRegistro").value;

    let password = document.getElementById("passwordRegistro").value;


    if(nombre === "" || correo === "" || password === ""){

        alert("Completa todos los campos.");

        return;

    }


    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


    let existe = usuarios.find(function(usuario){

        return usuario.correo === correo;

    });


    if(existe){

        alert("Ese correo ya está registrado.");

        return;

    }


    let nuevoUsuario = {

        nombre: nombre,

        correo: correo,

        password: password

    };


    usuarios.push(nuevoUsuario);


    localStorage.setItem("usuarios", JSON.stringify(usuarios));


    alert("Usuario registrado correctamente.");


    window.location.href = "login.html";

}