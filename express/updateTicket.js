
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
function javascript_abort()
{
   throw new Error('This is not an error. This is just to abort javascript');
}
/*---
Extrae del URL el id de cliente ya validado, su nombre y la última fecha de login, actualiza banner de seguridad
*/

var session = localStorage.getItem("MesaAyuda");
var clienteID = JSON.parse(session).clienteID;
var contacto = JSON.parse(session).contacto;
var nombre = JSON.parse(session).nombre;
var fecha_ultimo_ingreso = JSON.parse(session).fecha_ultimo_ingreso;

var estado_solucion;
var fecha_apertura;
var ultimo_contacto;
var solucion;
var descripcion;

console.log("localStorage id("+clienteID+") contacto("+contacto+") nombre("+nombre+") ultimo("+fecha_ultimo_ingreso+")");
document.getElementById("lastlogin").innerHTML = "<table><tr><td>Contacto</td><td>"+contacto+"</td></tr><tr><td>Cliente</td><td>"+clienteID+"</td></tr><tr><td>Nombre</td><td>"+nombre+"</td></tr><tr><td>Ultimo ingreso</td><td>"+fecha_ultimo_ingreso+"</td></tr></table>";

/*---
Accede a REST API para obtener detalle del ticket 
Tener en cuenta que typicode es un fake REST API
*/
//const APIREST_URL='http://my-json-server.typicode.com/lu7did/testJASON/ticket/';
//const APIREST_URL='https://xe3qolsgh0.execute-api.us-east-1.amazonaws.com/listarTicketGET?clienteID='+query.id;
const APIREST_URL='http://localhost:8080/api/getTicket';
const getTicketURL="http://127.0.0.1:5500/getTicket.html";

//clientID 0533a95d-7eef-4c6b-b753-1a41c9d1fbd0

const api_TicketURL=APIREST_URL;
const formE1=document.querySelector('.form');

/*---
Obtiene el ticket Id desde los argumentos
*/
var query = getQueryParams(document.location.search);
console.log("Ticket id received is("+query.id+")");
if (!query.id) {
    document.getElementById("lastlogin").innerHTML = "<center>*ERROR* Ticket ID no informado</center>";
    console.log("Ticket no informado");
    javascript_abort();
}
const id=query.id;
document.getElementById("lastlogin").innerHTML = "<table><tr><td>Contacto</td><td>"+contacto+"</td></tr><tr><td>Cliente</td><td>"+clienteID+"</td></tr><tr><td>Nombre</td><td>"+nombre+"</td></tr><tr><td>Ultimo ingreso</td><td>"+fecha_ultimo_ingreso+"</td></tr></table>";
document.getElementById("id").innerHTML="Ticket: "+id;

const ticket = {
    "id" : id,
};
    
const options = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
    };
console.log("ticket id:"+JSON.stringify(ticket));
console.log("options : "+JSON.stringify(options));

fetch(`${api_TicketURL}`,options)
.then(res => {
    return res.json();
}).then(t=>{

    console.log("recibido "+JSON.stringify(t));

    document.getElementById("solucion").innerHTML=t.data.Item.solucion;
    document.getElementById("descripcion").innerHTML=t.data.Item.descripcion.replace('\n','<br/>');

    var s=0;
    switch(t.data.Item.estado_solucion) {
        case 0 : s='inicial'; break;
        case 1 : s='primer nivel'; break;
        case 2 : s='2do nivel'; break;
        case 3 : s='resuelto'; break;
    }

    document.getElementById("status").innerHTML="Estado de Solucion {"+s+"}</br> Fecha apertura: "+t.data.Item.fecha_apertura+" Fecha ultimo contacto: "+t.data.Item.ultimo_contacto;
    estado_solucion=t.data.Item.estado_solucion;
    fecha_apertura=t.data.Item.fecha_apertura;
    ultimo_contacto=t.data.Item.ultimo_contacto;
    solucion=t.data.Item.solucion;
    descripcion=t.data.Item.descripcion;
});    


formE1.addEventListener('submit',  event => {

    event.preventDefault();
    const formData = new FormData(formE1);
    const data = Object.fromEntries(formData);

    console.log('Revisa el valor del form');
    console.log(data);



//const APIREST_URL='http://my-json-server.typicode.com/lu7did/testJASON/ticket/';
//const APIREST_URL='https://xe3qolsgh0.execute-api.us-east-1.amazonaws.com/listarTicketGET?clienteID='+query.id;

const APIRESTUPDATE_URL='http://localhost:8080/api/updateTicket';
const listarTicketURL="http://127.0.0.1:5500/listarTicket.html";

//clientID 0533a95d-7eef-4c6b-b753-1a41c9d1fbd0

    const api_updateTicketURL=APIRESTUPDATE_URL;
    const HTMLResponse=document.querySelector("#app");

    var hoy = new Date();
    var dd = String(hoy.getDate()).padStart(2, '0');
    var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = hoy.getFullYear();
    hoy = dd + '/' + mm + '/' + yyyy;


    const ticketUpdate = {
         "id" : id,
         "clienteID" : clienteID,
         "estado_solucion" : estado_solucion,
         "solucion"  : solucion,
         "descripcion" : descripcion.replace('<br/>','\n')+"\n{"+contacto+"} fecha:"+hoy+"\n"+data.descripcion+"\n",
         "fecha_apertura" : fecha_apertura
    };
    

    console.log(ticket);

    const optionsUpdate = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketUpdate),
    };
    console.log("ticket clienteID:"+JSON.stringify(ticket));
    console.log("options : "+JSON.stringify(optionsUpdate));


    fetch(`${api_updateTicketURL}`,optionsUpdate)
    .then(res => {
        return res.json();
    }).then(ticket=>{
        console.log("Actualizo exitosamente ticket");
        window.location.href = listarTicketURL;
    });    
    
})