
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
        Forma URL para acceder, typicode es un fake API REST para pruebas
        */

        const testLoginURL='http://my-json-server.typicode.com/lu7did/testJASON/posts/';
        const api_LoginURL=testLoginURL+data.username;

        /*---
        Genera objeto HTML a ser actualizado en el tag identificado como "app"
        */

        const HTMLResponse=document.querySelector("#app");
        const ul=document.createElement("ul");

        const tpl=document.createDocumentFragment();
        console.log("accediendo URL "+api_LoginURL);       

        /*-----
        Realiza el acceso al API Rest utilizando gestión de sincronización mediante promesas
        */

        fetch(`${api_LoginURL}`)
        .then((response)=>response.json())
        .then((users)=>{

            /*---
            Verifica si la password indicada por el usuario y la del REST API coinciden (AVISO DE SEGURIDAD)
            */

            if (users.password == data.password) {
                /*---
                Si la password coincide redirecciona a la página getClient.html para procesar tickets
                */
                console.log('La password es correcta');
                document.getElementById('resultado').style.color="BLACK";
                document.getElementById('resultado').textContent='Bienvenido al sistema '+users.nombre+', ultimo ingreso '+users.fecha_ultimo_ingreso;
                window.location.href = "http://127.0.0.1:5500/getClient.html?id="+users.id+"&nombre="+users.nombre+"&ultimo="+users.fecha_ultimo_ingreso;
            }  else {
                /*---
                Si no coinciden da mensaje de alerta y continua
                */
                console.log('La password no es correcta');
                document.getElementById('resultado').style.color="RED";
                document.getElementById('resultado').textContent='Error de login, intente nuevamente';
            }
            
        });
    });
