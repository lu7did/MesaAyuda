
    const formE1=document.querySelector('.form');

    /*---
    Intercepta el submit del formulario
    */

    formE1.addEventListener('submit',  event => {
        event.preventDefault();
        const formData = new FormData(formE1);
        const data = Object.fromEntries(formData);
        console.log('Revisa el valor del form');
        console.log(data);

        /*---
        Realiza validaciones en los datos del formulario antes de procesar
        */

        if (data.username == '' || data.password == '') {
            console.log('debe indicar usuario');
            document.getElementById('resultado').style.color="RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent='Debe informar usuario y password para  completar el acceso';
            return;
        }

        if (data.username == 'pec'){
            console.log('pec no es bienvenido en éste sistema');
            const m=`<li>El usuario <pec> no es bienvenido en éste sistema</li>`;
            document.getElementById('resultado').style.color="RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent='El usuario <pec> no es bienvenido en éste sistema';
            return;
        }
        if (data.termscondition != 'on') {
            console.log('no aceptó los T&C no se puede loggear');
            document.getElementById('resultado').style.color="RED";
            document.getElementById('resultado').style.textAlign = "center";
            document.getElementById('resultado').textContent='Debe aceptar los T&C para poder usar el sistema';
            return;
        }

        /*---
        Genera objeto HTML a ser actualizado en el tag identificado como "app"
        */
        
        const HTMLResponse=document.querySelector("#app");
        const ul=document.createElement("ul");

        const tpl=document.createDocumentFragment();
        
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
        

        /*-----
        Crea estructuras para acceder a data del cliente
        */
        const login = {
            "id"       : data.id,
            "password" : data.password
        };
            
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
            };

        console.log("API REST:"+RESTAPI.loginCliente);
        console.log(login);
        console.log("login("+JSON.stringify(login)+")");
        console.log("options "+JSON.stringify(options));

        /*-----
        Define el URI para realizar el acceso
        */
       
        var API=RESTAPI.loginCliente;
        var APIoptions=options;


        /*---- Typicode utilizar id 803a62c8-78c8-4b63-9106-73af216d504b -------*/
/*
        const tipycode=true;
        if (tipycode==true) {
            console.log("Acceso usando Typicode como application server");
            API="https://my-json-server.typicode.com/lu7did/MesaAyuda/posts/"+data.id;
            APIoptions = {method: 'GET'};
        }
*/       
        

        /*-----
        Realiza el acceso al API Rest utilizando gestión de sincronización mediante promesas
        */

        fetch(`${API}`,APIoptions)
        .then(res => {
            return res.json();
        }).then(users=>{
            console.log("Datos enviados por NodeJS local server="+JSON.stringify(users));
            console.log("users.response="+users.password);
            if (users.response == 'OK') {         //<==Habilitar esto para dejar que el API REST verifique sin exponer la password
                console.log('La password es correcta');
                console.log("nombre("+users.nombre+") fecha_ultimo_ingreso("+users.fecha_ultimo_ingreso+")");
                document.getElementById('resultado').style.color="BLACK";
                document.getElementById('resultado').textContent='Bienvenido al sistema '+users.nombre+', ultimo ingreso '+users.fecha_ultimo_ingreso;
                console.log("id="+users.id+" nombre="+users.nombre+" ultimo="+users.fecha_ultimo_ingreso);
                window.location.href = listarTicketURL+"?id="+users.id+"&contacto="+users.contacto+"&nombre="+users.nombre+"&fecha_ultimo_ingreso="+users.fecha_ultimo_ingreso;
            }  else {
                console.log('La password no es correcta');
                document.getElementById('resultado').style.color="RED";
                document.getElementById('resultado').textContent='Error de login, intente nuevamente';
            }

        })
    });
