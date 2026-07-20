function iniciarSesion() {

    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;

    if (correo === "" || password === "") {

        alert("Completa todos los campos.");

        return;

    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuarioEncontrado = usuarios.find(function(usuario){

        return usuario.correo === correo &&
               usuario.password === password;

    });

    if(usuarioEncontrado){

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioEncontrado)
        );

        alert("Bienvenido " + usuarioEncontrado.nombre);

        window.location.href = "dashboard.html";

    }else{

        alert("Correo o contraseña incorrectos.");

    }

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

function mostrarUsuario(){

    let usuario = JSON.parse(
        localStorage.getItem("usuarioActivo")
    );

    if(usuario){

        let titulo = document.getElementById("bienvenida");

        if(titulo){

            titulo.textContent =
            "¡Bienvenido, " + usuario.nombre + "! 👋";

        }

    }

}

window.addEventListener("load", mostrarUsuario);