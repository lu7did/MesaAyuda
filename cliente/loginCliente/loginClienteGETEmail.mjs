        //* loginClienteGETEmail
        //* API para acceder a un cliente y chequear su clave
        //* Este REST API utiliza el método HTTP GET en lugar de POST
        //* Dr. Pedro E. Colla
        //* UADER - Ingeniería de Software I
        //* (c) 2023 Dr. Pedro E. Colla
        //*-----------------------------------------------------------------------------*
            import { DynamoDBClient, GetItemCommand, UpdateItemCommand, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
	    import { randomUUID } from "crypto";
	    import {marshall,unmarshall}  from "@aws-sdk/util-dynamodb";

	    const ddbClient = new DynamoDBClient(new DynamoDBClient({}));
	    export const handler = async (event, context) => {
	    try {

//*---- Extrae los argumentos id y password

                const contacto=event['queryStringParameters']['contacto'];
	        const password=event['queryStringParameters']['password'];
	        
	        
//*---- Arma clave de búsqueda

          const scanKey=contacto;
                      const input = { // ScanInput
                            TableName: "cliente", // required
                            Select: "ALL_ATTRIBUTES" || "ALL_PROJECTED_ATTRIBUTES" || "SPECIFIC_ATTRIBUTES" || "COUNT",
                            ScanFilter: {
                                         'contacto': {
                                                ComparisonOperator: 'EQ' , /* required */
                                                AttributeValueList: [
                                                   { /* AttributeValue */
                                                     S : scanKey,
                                                   },
                                                 ]
                                         }
                            },
                           };

//*---- Realiza la busqueda
             
            const command = new ScanCommand(input);
            const response = await ddbClient.send(command);  
                            
//*---- Hace el unmarshalling de los datos pues NO es un objeto DynamoDBDocumentClient y por lo tanto el resultado es un JSON que
                                         
            const uresponse=response.Items.map(i=>unmarshall(i));

//*---- Si no encuentra al menos uno significa que ya el correo está utilizado y retorna con mensaje
                                                     
            if (response.Count == 0) {
               return {
                    statusCode: 401,
                    body: JSON.stringify({"data" : uresponse , "response" : "usuario no existe"}),
                };

            }

//*----- el objeto uresponse resultante de un scan es un ARRAY de objetos, no un único objeto como el caso de getItem
//*----- por lo tanto hay que referenciar el primer objeto. Lo correcto es uresponse[0].password y no uresponse.password
            
          if (uresponse[0].password != password) {
             return {
                  statusCode: 400,
     	            body: JSON.stringify({ "response":"usuario no existe" }),
             };
          }
	        

//*---- Valida que el usuario esté activo

          if (uresponse[0].activo != true) {
	     return {
                  statusCode: 401,
     	          body: JSON.stringify({ "response" : "El usuario no está activo" }),
             };
	  } 

//*--- Valida que no sea el primer ingreso

          if (uresponse[0].primer_ingreso == true) {
             return {
                statusCode: 403,
	        body: JSON.stringify({ "response" : "Requiere cambio de password" }),
             };
                
          } 

//*---> Sacar comentarios a las siguientes lineas para retornar solo la respuesta OK sin actualizar los datos de último ingreso
//           return {
//                  statusCode: 200,
//     	            body: JSON.stringify({ "response" : "OK" }),
//             };

//*----- si la validación ha sido buena debe actualizar la fecha de último ingreso

	//*--- Obtiene fecha corriente y puebla campos relacionados
    	    
      	var hoy = new Date();
        var dd = String(hoy.getDate()).padStart(2, '0');
        var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = hoy.getFullYear();
        hoy = dd + '/' + mm + '/' + yyyy;

//*---- Arma clave de búsqueda para localizar el registro y asegurarlo para actualización

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
                   S: uresponse[0].id 
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

//*---- es un login correcto así que retorna también el nombre y la fecha de último ingreso

            return {
                  statusCode: 200,
     	          body: JSON.stringify({"Nombre": uresp.nombre,"fecha_ultimo_ingreso":uresp.fecha_ultimo_ingreso,"response" : "OK"}),
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


