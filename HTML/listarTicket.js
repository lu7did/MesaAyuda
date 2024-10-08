
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

console.log("Comienza listarTicket.js");

var query = getQueryParams(document.location.search);
console.log("id:"+query.id);
console.log("contacto:"+query.contacto);
console.log("nombre:"+query.nombre);
console.log("ultima_fecha:"+query.fecha_ultimo_ingreso);

document.getElementById("lastlogin").innerHTML = "<table><tr><td>Cliente</td><td>"+query.id+"</td></tr><tr><td>Contacto</td><td>"+query.contacto+"</td></tr></tr><tr><td>Nombre</td><td>"+query.nombre+"</td></tr><tr><td>Ultimo ingreso</td><td>"+query.fecha_ultimo_ingreso+"</td></tr></table>";


/*---
Accede a REST API para obtener tickets
Tener en cuenta que typicode es un fake REST API
*/

//const APIREST_URL='http://my-json-server.typicode.com/lu7did/testJASON/ticket/';
// URL para acceder directamente a ésta función
//http://127.0.0.1:5500/listarTicket.html?id=0533a95d-7eef-4c6b-b753-1a41c9d1fbd0&nombre=Pedro%20E.%20Colla&ultimo=01/11/2023
//

//const APIREST_URL='https://xe3qolsgh0.execute-api.us-east-1.amazonaws.com/listarTicketGET?clienteID='+query.id;
//clientID 0533a95d-7eef-4c6b-b753-1a41c9d1fbd0




//const api_TicketURL=APIREST_URL;

//fetch(`${api_TicketURL}`)

const HTMLResponse=document.querySelector("#app");
const systemURL={ 

    listarTicket    : "http://127.0.0.1:5500/listarTicket.html",
    addTicket       : "http://127.0.0.1:5500/addTicket.html",
    updateTicket    : "http://127.0.0.1:5500/updateTicket.html",
    loginCliente    : "http://127.0.0.1:5500/loginClient.html",
    updateCliente   : "http://127.0.0.1:5500/updateCliente.html",
    addCliente      : "http://127.0.0.1:5500/addCliente.html",
    resetCliente    : "http://127.0.0.1:5500/resetCliente.html"

};

const RESTAPI={
    loginCliente    : "http://127.0.0.1:8080/api/loginCliente",
    listarTicket    : "http://localhost:8080/api/listarTicket",
    addCliente      : "http://localhost:8080/api/addCliente",
    getTicket       : "http://localhost:8080/api/getTicket",
    updateTicket    : "http://localhost:8080/api/updateTicket",
    getCliente      : "http://localhost:8080/api/getCliente",
    updateCliente   : "http://localhost:8080/api/updateCliente"
};

const clienteID=query.id;

const ticket = {
    "clienteID" : clienteID,
};
    
const options = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
    };

console.log("API_listarTicket:"+RESTAPI.listarTicket);    
console.log("ticket  :"+JSON.stringify(ticket));
console.log("options :"+JSON.stringify(options));


fetch(`${RESTAPI.listarTicket}`,options)
.then(res => {
    return res.json();
}).then(ticket=>{
    console.log(ticket);
    let f=false;
    let table=document.createElement("table");
    table.style.border="1px solid";
    table.style.backgroundColor="##626607";
    ticket.data.forEach((t)=> {
        console.log(t.clienteID)
        if (t.clienteID == query.id) {
            if (f==false) {
                f=true;
                const hdr=["Cliente","ID","Motivo","Estado","Fecha"];
                let tr=document.createElement("tr");
                tr.style.border="1px solid";
                hdr.forEach((item) => {
                    let th=document.createElement("th");
                    th.style.border="1px solid";

                    th.innerText = item;
                    tr.appendChild(th);
                });
                table.appendChild(tr);                   
            }

            const body=[t.clienteID,`${t.id}`,`${t.solucion}`,`${t.estado_solucion}`,`${t.ultimo_contacto}`];
            let trl=document.createElement("tr");
            body.forEach((line) => {
                let td=document.createElement("td");
                td.style.border="1px solid";
                td.innerText = line;
                trl.appendChild(td);
            });
            table.appendChild(trl);                   
        }
    });

    if (f) {
        console.log(table);
        HTMLResponse.appendChild(table);
    } else {

        console.log("no tiene tickets");
        document.getElementById('mensajes').style.textAlign = "center";
        document.getElementById('mensajes').style.color="RED";
        document.getElementById("mensajes").innerHTML = "No hay tickets pendientes";
    }
});
