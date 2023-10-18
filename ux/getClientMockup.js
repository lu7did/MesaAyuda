
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

var query = getQueryParams(document.location.search);
console.log("id received is("+query.id+")");
console.log("id received is("+query.nombre+")");
console.log("id received is("+query.ultimo+")");
document.getElementById("lastlogin").innerHTML = "Cliente("+query.id+") Contacto("+query.nombre+") ultimo ingreso("+query.ultimo+")";


/*---
Accede a REST API para obtener tickets
Tener en cuenta que typicode es un fake REST API
*/

const testTicketURL='http://my-json-server.typicode.com/lu7did/testJASON/ticket/';

const api_TicketURL=testTicketURL;
const HTMLResponse=document.querySelector("#app");

/*---
Accede al REST API de tickets para obtener información
*/

fetch(`${api_TicketURL}`)
.then((response)=>response.json())
.then((ticket)=>{
    let f=false;
    let table=document.createElement("table");
    /*---
    Recibe tickets y los explora
    */
    ticket.forEach((t)=> {
        if (t.clienteID == query.id) {
            if (f==false) {
                /*---
                En el primer ticket a listar pone encabezados
                */

                f=true;
                const hdr=["Cliente","ID","Motivo","Estado","Fecha"];
                let tr=document.createElement("tr");
                hdr.forEach((item) => {
                    let th=document.createElement("th");
                    th.innerText = item;
                    tr.appendChild(th);
                });
                table.appendChild(tr);                   
            }
            /*---
            Lista todos los tickets
            */

            const body=[t.clienteID,`${t.id}`,`${t.solucion}`,`${t.estado_solucion}`,`${t.ultimo_contacto}`];
            let trl=document.createElement("tr");
            body.forEach((line) => {
                let td=document.createElement("td");
                td.innerText = line;
                trl.appendChild(td);
            });
            table.appendChild(trl);                   

        }
    });
    /*---
    Si hubo al menos un ticket inserta la tabla recién construida y la página HTML
    */

    if (f) {
        HTMLResponse.appendChild(table);
    } else {
        /*---
        Si no hubo al menos un ticket informa en la página HTML
        */
       
        console.log("no tiene tickets");
        document.getElementById('mensajes').style.textAlign = "center";
        document.getElementById('mensajes').style.color="RED";
        document.getElementById("mensajes").innerHTML = "No hay tickets pendientes";
    }
});



