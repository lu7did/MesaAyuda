
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
Accede a REST API para obtener tickets
Tener en cuenta que typicode es un fake REST API
*/

//const APIREST_URL='http://my-json-server.typicode.com/lu7did/testJASON/ticket/';
//const APIREST_URL='https://xe3qolsgh0.execute-api.us-east-1.amazonaws.com/listarTicketGET?clienteID='+query.id;
const APIREST_URL='http://localhost:8080/api/listarTicket';
const addTicketURL="http://127.0.0.1:5500/addTicket.html";
const updateTicketURL="http://127.0.0.1:5500/updateTicket.html";

//clientID 0533a95d-7eef-4c6b-b753-1a41c9d1fbd0

const api_TicketURL=APIREST_URL;
const HTMLResponse=document.querySelector("#app");


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
console.log("ticket clienteID:"+JSON.stringify(ticket));
console.log("options : "+JSON.stringify(options));


fetch(`${api_TicketURL}`,options)
.then(res => {
    return res.json();
}).then(ticket=>{
    let f=false;
    let table=document.createElement("table");
    table.style.border="1px solid";
    table.style.backgroundColor="#ADD8E6";
    ticket.data.forEach((t)=> {
        if (t.clienteID == clienteID) {
            if (f==false) {
                f=true;
                const hdr=["ID","Motivo","Estado","Fecha"];
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
            const tid=`${t.id}`;
            const aref=updateTicketURL+'?id='+tid;
            const body=["#ref",`${t.solucion}`,`${t.estado_solucion}`,`${t.ultimo_contacto}`];
            let trl=document.createElement("tr");
            body.forEach((line) => {
                let td=document.createElement("td");
                td.style.border="1px solid";
                if (line=="#ref") {
                    let ax=document.createElement("a");
                    ax.href=aref;
                    ax.innerText = tid;
                    td.appendChild(ax);
                } else {
                    td.innerText = line;
                }
                trl.appendChild(td);
            });
            table.appendChild(trl);                   

        }
    });

    if (f) {
        HTMLResponse.appendChild(table);
    } else {
        console.log("no tiene tickets");
        document.getElementById('mensajes').style.textAlign = "center";
        document.getElementById('mensajes').style.color="RED";
        document.getElementById("mensajes").innerHTML = "No hay tickets pendientes";
    }
});
window.onload = function() {
    document.getElementById('newticket').onsubmit = function() {
        console.log("<Click> trato de submitir pero no se lo permiti id="+clienteID+" window.location.href="+addTicketURL);
        window.location.href = addTicketURL;
        return false;
    }    
}
