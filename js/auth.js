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