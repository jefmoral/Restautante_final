// varibales global del formulario

const d = document;
let nameInput = d.querySelector("#productos-select")
let priceInput = d.querySelector("#precio-pro")
let stockInput = d.querySelector("#stock-pro")
let descripcionInput = d.querySelector("#des-pro")
let imagen = d.querySelector("#imagen-pro")
let btnCreate = d.querySelector(".btn-create")
let productUpdate;
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

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

//evento al boton del formulario crear producto
btnCreate.addEventListener("click", ()=>{
    //alert ("producto:" + nameInput.value)
    let dataProduct = getDataProduct();
    sendDataProduct(dataProduct);
})

//evento al navegador para comprobar si recargo la pagina
d.addEventListener("DOMContentLoaded", ()=>{
    getUser();
    productUpdate = JSON.parse(localStorage.getItem("producEdit")); //carga los datos que estan en localStorage
    if (productUpdate != null){ //si hay algo es que voy a actulizar si no hay nada voy a crear
        updateDataProduct();
    }
})

//funcion para validar el formulario y obtener los datos
let getDataProduct = () => {
    // validar formulario
    let product;
    //validacion para que todos los campos esten diligenciados
    if (nameInput.value && priceInput.value && stockInput.value && descripcionInput.value && imagen.src){
        product = {
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio : priceInput.value,
            stock : stockInput.value,
            imagen : imagen.src
        }
        //limpiar formulario
        priceInput.value="";
        descripcionInput.value="";
        stockInput.value="";
        imagen.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
        console.log(product)
    }else {
        alert("Todos los campos son obligatorios")
    }
    return product;
};

//funcion para recibir los datos y realizar la peticion al servidor

let sendDataProduct = async (data) =>{
    let url = "http://localhost/backend-apiCrud/productos"
     // respuesta de errores
     try{
        let respuesta = await fetch(url,{ // como va a tener un retraso de debe colocar en await y este va con el async que se coloca antes de la funcion flecha
            method: "POST", //metodo con el cual se envian los datos
            headers:{ //encabezados de la peticion
                "Content-Type" : "application/json" // el contenido que se va a enviar es tipo JSON
            },
            body : JSON.stringify(data) //cuerpo de la peticion 
        });
        if (respuesta.status === 406){
            alert("Los Datos Enviados no son admitidos")
        }else {
            let Mensaje = await respuesta.json(); 
            alert(Mensaje.message)
            location.href = "../listado-pro.html"   
        }
          } catch(error){
            console.log(error);
     }       
}

// //funcion para editar el producto

let updateDataProduct = () => {
    ////cargar datos a editar en los campos del formulario
    nameInput.value = productUpdate.nombre;
    priceInput.value = productUpdate.precio;
    stockInput.value = productUpdate.stock;
    descripcionInput.value = productUpdate.descripcion;
    imagen.src = productUpdate.imagen;
    let product;
    
    //alternar el boton crear y editar
    let btnEdit = d.querySelector(".btn-update");
    btnCreate.classList.toggle("d-none");
    btnEdit.classList.toggle("d-none");

    //agregar evento al boton editar
    btnEdit.addEventListener("click", ()=>{
        //crear el objeto con informacion del formulario
        product = {
            id: productUpdate.id,
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio : priceInput.value,
            stock : stockInput.value,
            imagen : imagen.src
        }
        //borrar info del localStorage
        localStorage.removeItem("productEdit");
        // pasar los datos del producto a la funcion
        sendUpdateProduct(product); //se le envia la informacion del formulario creada anteriormente product linea 111
    })

};

// //funcion para realizar la peticion al servidor
let sendUpdateProduct = async (pro) =>{
        let url = "http://localhost/backend-apiCrud/productos"
         // respuesta de errores
         try{
            let respuesta = await fetch(url,{ // como va a tener un retraso de debe colocar en await y este va con el async que se coloca antes de la funcion flecha
                method: "PUT", //metodo con el cual se envian los datos
                headers:{ //encabezados de la peticion
                    "Content-Type" : "application/json" // el contenido que se va a enviar es tipo JSON
                },
                body : JSON.stringify(pro) //cuerpo de la peticion 
            });
            if (respuesta.status === 406){
                alert("Los Datos Enviados no son admitidos");
            }else {
                let Mensaje = await respuesta.json(); 
                alert(Mensaje.message)
                location.href = "../listado-pro.html";
            }
              } catch(error){
                console.log(error);
         }  
};