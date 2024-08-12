        //*------------------------------------------------------------------------------*
        //* loginClienteGET
        //* API para acceder a un cliente y chequear su clave
        //* Este REST API utiliza el método HTTP GET en lugar de POST
        //* Dr. Pedro E. Colla
        //* UADER - Ingeniería de Software I
        //* (c) 2023 Dr. Pedro E. Colla
        //*-----------------------------------------------------------------------------*
        
        import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
	    import { randomUUID } from "crypto";
	    import {marshall,unmarshall}  from "@aws-sdk/util-dynamodb";

	    const ddbClient = new DynamoDBClient(new DynamoDBClient({}));
	    export const handler = async (event, context) => {
	    try {

//*---- Extrae los argumentos id y password

	        const id=event['queryStringParameters']['id'];
	        const password=event['queryStringParameters']['password'];
	        
	        //const cliente = JSON.parse(event.body);
	        
//*---- Arma clave de búsqueda

         /*---- Recuperar el cliente desde la base ----*/

          var input = {
               Key: { "id" : {"S" : id}},
               TableName : "cliente"
          };

          const command = new GetItemCommand(input);
          const response = await ddbClient.send(command);
          const uresponse = unmarshall(response.Item);
          
          if (uresponse.password != password) {
          
             return {
                  statusCode: 400,
     	            body: JSON.stringify({ "response" : "invalid" }),
             };
	        }
	        
	        if (uresponse.activo != true) {
	           return {
                  statusCode: 401,
     	            body: JSON.stringify({ "response" : "invalid" }),
             };
	        } 
            if (uresponse.primer_ingreso == true) {
	           return {
                  statusCode: 402,
     	            body: JSON.stringify({ "response" : "cambio password" }),
             };
                
            } 

//*----- si la validación ha sido buena debe actualizar la fecha de último ingreso

	//*--- Obtiene fecha corriente y puebla campos relacionados
    	    
      	var hoy = new Date();
        var dd = String(hoy.getDate()).padStart(2, '0');
        var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = hoy.getFullYear();
        hoy = dd + '/' + mm + '/' + yyyy;

//*---- Arma clave de búsqueda

        const u = { 
            ExpressionAttributeNames: { 
                 "#f": "fecha_ultimo_ingreso"
            }, 
            ExpressionAttributeValues: { 
                ":f": { 
                   S: hoy,
                }, 
           }, 
           Key: { 
               "id": { 
                   S: id 
           }}, 
           ReturnValues: "ALL_NEW", 
           TableName: "cliente", 
           UpdateExpression: "SET #f = :f " 
};



//*---- Realiza la busqueda y actualización
            
            const c = new UpdateItemCommand(u);
            const resp = await ddbClient.send(c);

//*---- Hace el unmarshalling de los datos pues NO es un objeto DynamoDBDocumentClient y por lo tanto el resultado es un JSON que

            const uresp=unmarshall(resp.Attributes);

            return {
                  statusCode: 200,
     	          body: JSON.stringify({"id" : id, "password" : password,"nombre" : uresp.nombre,"fecha_ultimo_ingreso":uresp.fecha_ultimo_ingreso,"response" : "OK"}),
     	      };


//*----- Si algo anda mal retorna el error
                                                     
           } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
     	            body: JSON.stringify({ message: error.message , "response" : "Error" }),
                };
            }

};


