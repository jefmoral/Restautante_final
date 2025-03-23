// variables globales del formulario de login
const d = document;
userInput = d.querySelector("#usuarioForm");
passInput = d.querySelector("#contraForm");
btnLogin = d.querySelector(".btnLogin")

//evento al boton del formulario
btnLogin.addEventListener("click", () => {
    // alert("escrubio:" + userInput.value); // ejemplo para validar
   let dataForm = getData();
   sendData(dataForm);
})

//funcion para validar el formulario
//obtener datos del formulario
let getData = () => {
    // validar formulario
    let user;
    if (userInput.value && passInput.value){
        user = {
            usuario: userInput.value,
            contrasena: passInput.value
        }
        userInput.value="";
        passInput.value="";
    }else {
        alert("El usuario y la contraseña es obligatorio")
    }
    console.log(user);
    return user;
}

//funcion para recibir los datos y realizar la peticion al servidor

let sendData = async (data) =>{
    let url = "http://localhost/backend-apiCrud/login"
     // respuesta de errores
     try{
        let respuesta = await fetch(url,{ // como va a tener un retraso de debe colocar en await y este va con el async que se coloca antes de la funcion flecha
            method: "POST", //metodo con el cual se envian los datos
            headers:{ //encabezados de la peticion
                "Content-Type" : "application/json" // el contenido que se va a enviar es tipo JSON
            },
            body : JSON.stringify(data) //cuer po de la peticion 
        });
        if (respuesta.status === 401){
            alert("El usuario y/o la contraseña es incorrecta")
        }else {
            let userlogin = await respuesta.json(); 
            //console.log(userlogin); validar la respuesta esta ok
            alert(`Bienvenido: ${userlogin.nombre}`);
            //guardar datos en localstorage
            localStorage.setItem("userlogin", JSON.stringify(userlogin));
            location.href = "index.html";  //redirigirlo con un objeto tipo navegador location para saber de donde vengo y tiene diferentes funciones como href para redireccion o reload para cargar
        }
          } catch(error){
            console.log(error);
     }       
}
     