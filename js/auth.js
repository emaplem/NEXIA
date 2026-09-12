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

    let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if(!usuario) return;

    let bienvenida = document.getElementById("bienvenida");

    if(bienvenida){
        bienvenida.textContent = "¡Bienvenido, " + usuario.nombre + "! 👋";
    }

    let nombrePerfil = document.getElementById("nombre-perfil");
    let correoPerfil = document.getElementById("correo-perfil");

    if(nombrePerfil){
        nombrePerfil.textContent = usuario.nombre;
    }

    if(correoPerfil){
        correoPerfil.textContent = usuario.correo;
    }

}

function protegerDashboard() {

    // Solo ejecutar esta función en dashboard.html
    if (!window.location.pathname.endsWith("dashboard.html")) {
        return;
    }

    let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuario) {

        alert("Debes iniciar sesión para acceder.");

        window.location.href = "login.html";

    }

}


window.addEventListener("load", mostrarUsuario);
window.addEventListener("load", protegerDashboard);

function cerrarSesion() {

    localStorage.removeItem("usuarioActivo");

    window.location.href = "login.html";

}