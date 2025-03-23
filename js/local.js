//variables globales del admin
const d = document;

let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

d.addEventListener("DOMContentLoaded", () =>{
    getUser();
})

//funcion para poner el nombre de usuario
let getUser = ()=>{
    let user = JSON.parse(localStorage.getItem("userlogin")) //se coloca la variable con la que estoy guardando los datos
    nameUser.textContent = user.nombre;
}

//evento para el boton de logout
btnLogout.addEventListener("click", ()=>{
    localStorage.removeItem("userlogin"); //eliminar datos del local storage
    location.href = "../login.html";
})
