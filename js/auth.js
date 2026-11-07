
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function iniciarSesion() {
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (!correo || !password) {
        alert("Completa todos los campos.");
        return;
    }

    const usuarios = obtenerUsuarios();

    const usuarioEncontrado = usuarios.find(function(usuario) {
        return usuario.correo.toLowerCase() === correo &&
               usuario.password === password;
    });

    if (!usuarioEncontrado) {
        alert("Correo o contraseña incorrectos.");
        return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

    window.location.href = "dashboard.html";
}

function registrarUsuario() {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim().toLowerCase();
    const password = document.getElementById("passwordRegistro").value;

    if (!nombre || !correo || !password) {
        alert("Completa todos los campos.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Ingresa un correo electrónico válido.");
        return;
    }

    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(function(usuario) {
        return usuario.correo.toLowerCase() === correo;
    });

    if (existe) {
        alert("Ese correo ya está registrado.");
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        password: password
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente.");
    window.location.href = "login.html";
}

function mostrarUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuario) return;

    const bienvenida = document.getElementById("bienvenida");
    const nombrePerfil = document.getElementById("nombre-perfil");
    const correoPerfil = document.getElementById("correo-perfil");
    const nombreTopbar = document.getElementById("nombre-topbar");

    if (bienvenida) {
        bienvenida.textContent = "¡Bienvenido, " + usuario.nombre + "! 👋";
    }

    if (nombrePerfil) {
        nombrePerfil.textContent = usuario.nombre;
    }

    if (correoPerfil) {
        correoPerfil.textContent = usuario.correo;
    }

    if (nombreTopbar) {
        nombreTopbar.textContent = usuario.nombre;
    }
}

function protegerDashboard() {
    if (!window.location.pathname.endsWith("dashboard.html")) {
        return;
    }

    const usuario = localStorage.getItem("usuarioActivo");

    if (!usuario) {
        alert("Debes iniciar sesión para acceder.");
        window.location.href = "login.html";
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}

window.addEventListener("load", function() {
    protegerDashboard();
    mostrarUsuario();
});
