//variables globales

const d = document;
let tablePro = d.querySelector("#table-pro > tbody"); //seleccionar tabla donde se insertaran los datos
let searchInput = d.querySelector("#search-input");
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

//evento para probar el campo de buscar
searchInput.addEventListener("keyup", ()=>{
    //console.log(searchInput.value);  
    searchProductTable();
})

//evento para el navegador 
document.addEventListener("DOMContentLoaded", () =>{
    getTableData();
    getUser();
});

//funcion para traer los datos de la BD a la tabla
let getTableData = async () =>{
    let url = "http://localhost/backend-apiCrud/productos"
    try{
        let respuesta = await fetch(url,{ // como va a tener un retraso de debe colocar en await y este va con el async que se coloca antes de la funcion flecha
            method: "GET", //metodo con el cual se piden los datos
            headers:{ //encabezados de la peticion
                "Content-Type" : "application/json" // el contenido que se va a enviar es tipo JSON
            },
        });
        if (respuesta.status === 204){
            console.log("No hay Datos en la base de datos")
        }else {
            let tableData = await respuesta.json();
            console.log(tableData) 
            
            //agregar los datos de la tabla a localstorage para no estar haciendo peticiones a la bd.
            localStorage.setItem("datosTabla", JSON.stringify(tableData)) // guardar datos en formato texto en json con stringify
            
            // agregar los datos a la tabla
            tableData.forEach((dato, i) => {  //la i simula la posicion del dato en el array y el dato es la clave de la informacion del objeto 
                let row = document.createElement("tr") //row es la fila a crear --- tr para crear filas en la tabla
                row.innerHTML = `
                    <td> ${i+1} </td>
                    <td> ${dato.nombre} </td> 
                    <td> ${dato.descripcion} </td>
                    <td> ${dato.precio} </td> 
                    <td> ${dato.stock} </td>
                    <td> <img src "${dato.imagen}" witch ="100"> </td>
                    <td> 
                        <button id= "btn-edit" onclick="editdataTable(${i})"  type="button" class="btn btn-outline-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                        </button> -
                        ${ nameUser.textContent == "vendedor" ? "":
                        `<button id = "btn-delet" onclick="deletedataTable(${i})" type="button" class="btn btn-outline-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>  
                        </button>`}   
                    </td>  
                `
                tablePro.appendChild(row) //pasale filas a la tabla
            });
            
              }
          } catch(error){
            console.log(error);
     }       
}

//funcion para editar algun producto de la tabla
let editdataTable = (pos) =>{
    let products = []; //array vacio para guardar los datos
    let productsSave = JSON.parse(localStorage.getItem("datosTabla")) //datosTabla fue el codigo que le di a la info en localStorage
    if (productsSave != null){ //validar que el array no este vacio
            products = productsSave;
    }
    //console.log(products);
    let singleProduct = products[pos]; //para guardar la posicion del producto
    //
    localStorage.setItem("producEdit", JSON.stringify(singleProduct)); //guarda dato en localstorage
    localStorage.removeItem("datosTabla")//borrar los datos de la tabla y solo quede el que voy a editar
    location.href = "../crear-pro.html"; //redidigirse a la pagina donde esta el producto a editar
}


//funcion para eliminar un elemento de la tabla
let deletedataTable = (pos) =>{
    let products = []; //array vacio para guardar los datos
    let productsSave = JSON.parse(localStorage.getItem("datosTabla")) //datosTabla fue el codigo que le di a la info en localStorage
    if (productsSave !=null){ //validar que el array no este vacio
            products = productsSave;
    }
    //console.log(products);
    let singleProduct = products[pos];
    console.log("productos a eliminar" +singleProduct.nombre);
    //obtener ID para enviarlo a eliminar
    let IDProduct = {
        id : singleProduct.id // conocer la posicion ID a eiminar 
    }
    let confirmar = confirm(`¿Deseas Eliminar? ${singleProduct.nombre} `);
    if (confirmar){
        //llamar la funcion para realizar la peticion
        sendDeleteProduct (IDProduct); //se llama la funcion y se le envia la posicion a eliminar
    }
    
}

//funcion para realizar la peticion de eliminar el producto
let sendDeleteProduct = async (id) =>{
    let url = "http://localhost/backend-apiCrud/productos"
     // respuesta de errores
     try{
        let respuesta = await fetch(url,{ // como va a tener un retraso de debe colocar en await y este va con el async que se coloca antes de la funcion flecha
            method: "DELETE", //metodo con el cual se envian los datos
            headers:{ //encabezados de la peticion
                "Content-Type" : "application/json" // el contenido que se va a enviar es tipo JSON
            },
            body : JSON.stringify(id) //cuerpo de la peticion 
        });
        if (respuesta.status === 406){
            alert("El ID enviado no fue admintido")
        }else {
            let Mensaje = await respuesta.json(); 
            alert(Mensaje.message)
            location.reload();
        }
          } catch(error){
            console.log(error);
     }       
}

//funcion para quitar productos de la tabla
let clearDataTable = () =>{
    let rowTable = d.querySelectorAll("#table-pro > tbody >tr ");
    rowTable.forEach((row)=>{
        row.remove();
    });
}

//funcion oara buscar un producto en la tabal
let searchProductTable = () =>{
    let products = []; //array vacio para guardar los datos
    let productsSave = JSON.parse(localStorage.getItem("datosTabla")) //datosTabla fue el codigo que le di a la info en localStorage
    if (productsSave !=null){ //validar que el array no este vacio
            products = productsSave;
    }
    //obtener lo escrito en el campo de texto buscar
    let textSearch = searchInput.value.toLowerCase(); //tolowercase todo lo que se escriba lo pasa a miniscula

    //borar tabla para que no duplique la info
    clearDataTable();

    //hacer un ciclo para buscar  cada palabra ingresa si esta en cada item de la lista
    let i = 0;
    for (let pro of products){
        if(pro.nombre.toLowerCase().indexOf(textSearch) != -1){ //indexOf en el objeto busca si el nombre coincide con texto buscado si no encuentra nada devuelve -1
            let row = document.createElement("tr") //row es la fila a crear --- tr para crear filas en la tabla
                row.innerHTML = `
                    <td> ${i++} </td>
                    <td> ${pro.nombre} </td> 
                    <td> ${pro.descripcion} </td>
                    <td> ${pro.precio} </td> 
                    <td> ${pro.stock} </td>
                    <td> <img src "${pro.imagen}" witch ="100"> </td>
                    <td> 
                        <button id= "btn-edit" onclick="editdataTable(${i})"  type="button" class="btn btn-outline-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                        </button> -
                        ${ nameUser.textContent == "vendedor" ? "":
                        `<button id = "btn-delet" onclick="deletedataTable(${i})" type="button" class="btn btn-outline-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>  
                        </button>`}   
                    </td>  
                `
                tablePro.appendChild(row) //pasale filas a la tabla
        } 
    }
}
