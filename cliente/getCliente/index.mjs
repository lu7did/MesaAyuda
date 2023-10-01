  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
	import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
	import { GetItemCommand } from "@aws-sdk/client-dynamodb";
	import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
	import { randomUUID } from "crypto";
	const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
	export const handler = async (event, context) => {
	    try {
	        const cliente = JSON.parse(event.body);
    	    
    	    //*--- Obtiene fecha corriente y puebla campos relacionados
    	    
    	      var hoy = new Date();
            var dd = String(hoy.getDate()).padStart(2, '0');
            var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = hoy.getFullYear();
            hoy = dd + '/' + mm + '/' + yyyy;

	        
	 /*---- Recuperar el cliente desde la base ----*/
	 
            var input = {
                    Key: { "id" : {"S" : cliente.id}},
                    TableName : "cliente"
            };
                           
            const command = new GetItemCommand(input);
            const response = await ddbDocClient.send(command);
            try {
            	if (response.Item.id == 0) ;
            } catch {
  	          return {
	               statusCode: 400,
	               body: JSON.stringify({"response" : "Id no existe" }),
	          }
            }

	          return {
	            statusCode: 200,
	            body: JSON.stringify({"data" : response , "response" : "OK"}),
	          }
  
	    } catch (error) {
	        console.error(error);
	        return {
	            statusCode: 500,
	            body: JSON.stringify({ message: error.message , "response" : "Error" }),
	        };
	        
	    }
};


