
       //*------------------------------------------------------------------------------*
        //* addCliente
        //* API para dar de alta clientes forzando reglas de negocios
        //*
        //* Dr. Pedro E. Colla
        //* UADER - Ingeniería de Software I
        //* (c) 2023 Dr. Pedro E. Colla
        //*-----------------------------------------------------------------------------*
        
    import { DynamoDBClient, GetItemCommand, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
	import { randomUUID } from "crypto";
	import {marshall,unmarshall}  from "@aws-sdk/util-dynamodb";

	const ddbClient = new DynamoDBClient(new DynamoDBClient({}));
	export const handler = async (event, context) => {
	    try {
	        const cliente = JSON.parse(event.body);
//*---- Arma clave de búsqueda
           
             const scanKey=cliente.contacto;
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
                
//*---- Si encuentra algo significa que ya el correo está utilizado y retorna con mensaje
                            
            if (response.Count != 0) {
               return {
                    statusCode: 400,
     	            body: JSON.stringify({"data" : uresponse , "response" : "already in data base"}),
                };
            	
            }                

        	//*--- Obtiene fecha corriente y puebla campos relacionados
    	    
    	    var hoy = new Date();
            var dd = String(hoy.getDate()).padStart(2, '0');
            var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = hoy.getFullYear();
            hoy = dd + '/' + mm + '/' + yyyy;
            
            //*---- Genera registro para dar de alta al cliente
            
            const newCliente = {
  	                id                    : randomUUID(),
    	            contacto              : cliente.contacto,
	            	nombre                : cliente.nombre,
	            	password              : "secret",
	            	activo                : true,
	            	registrado            : false,
	            	primer_ingreso        : true,
	            	fecha_alta            : hoy,
	            	fecha_cambio_password : hoy,
	            	fecha_ultimo_ingreso  : hoy,
	        };
	      
	        //*---- Hace marshalling de datos para dynamoDB y graba
	        
            const mnewCliente = marshall(newCliente);
   	        const resp=await ddbClient.send(new PutItemCommand({
	            TableName: "cliente",
	            Item: mnewCliente,
	            ConditionExpression:'attribute_not_exists(contacto)',
	            }
	        ));
	        
	        //*----- retorna estructura
	        
	        return {
	            statusCode: 200,
            	body: JSON.stringify({"cliente" : newCliente , "response" : "OK"}),
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