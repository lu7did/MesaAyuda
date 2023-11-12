
/*---
Función para procesar los parámetros recibidos en el URL
*/
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

/*---
Extrae del URL el id de cliente ya validado, su nombre y la última fecha de login, actualiza banner de seguridad
*/

var session = localStorage.getItem("MesaAyuda");
var clienteID = JSON.parse(session).clienteID;
var contacto = JSON.parse(session).contacto;
var nombre = JSON.parse(session).nombre;
var fecha_ultimo_ingreso = JSON.parse(session).fecha_ultimo_ingreso;

console.log("localStorage id("+clienteID+") contacto("+contacto+") nombre("+nombre+") ultimo("+fecha_ultimo_ingreso+")");
document.getElementById("lastlogin").innerHTML = "<table><tr><td>Contacto</td><td>"+contacto+"</td></tr><tr><td>Cliente</td><td>"+clienteID+"</td></tr><tr><td>Nombre</td><td>"+nombre+"</td></tr><tr><td>Ultimo ingreso</td><td>"+fecha_ultimo_ingreso+"</td></tr></table>";

/*---
Accede a REST API para obtener tickets
Tener en cuenta que typicode es un fake REST API
*/

const formE1=document.querySelector('.form');
formE1.addEventListener('submit',  event => {

    event.preventDefault();
    const formData = new FormData(formE1);

    const data = Object.fromEntries(formData);

    console.log('Revisa el valor del form');
    console.log(data);
//const APIREST_URL='http://my-json-server.typicode.com/lu7did/testJASON/ticket/';
//const APIREST_URL='https://xe3qolsgh0.execute-api.us-east-1.amazonaws.com/listarTicketGET?clienteID='+query.id;
    const APIREST_URL='http://localhost:8080/api/addTicket';
    const listarTicketURL="http://127.0.0.1:5500/listarTicket.html";

//clientID 0533a95d-7eef-4c6b-b753-1a41c9d1fbd0

    const api_addTicketURL=APIREST_URL;
    const HTMLResponse=document.querySelector("#app");


    const ticket = {
         "clienteID" : clienteID,
         "solucion"  : data.ticket,
         "descripcion" : data.descripcion
    };
    
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
    };
    console.log("ticket clienteID:"+JSON.stringify(ticket));
    console.log("options : "+JSON.stringify(options));


    fetch(`${api_addTicketURL}`,options)
    .then(res => {
        return res.json();
    }).then(ticket=>{
        console.log("insertó exitosamente ticket ");
        window.location.href = listarTicketURL;
        return false;
    });    
    
});