
       //*------------------------------------------------------------------------------*
        //* getCliente
        //* API para acceder a un cliente dada su clave
        //*
        //* Dr. Pedro E. Colla
        //* UADER - Ingeniería de Software I
        //* (c) 2023 Dr. Pedro E. Colla
        //*-----------------------------------------------------------------------------*
        
    import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
	import { randomUUID } from "crypto";
	import {marshall,unmarshall}  from "@aws-sdk/util-dynamodb";

	const ddbClient = new DynamoDBClient(new DynamoDBClient({}));
	export const handler = async (event, context) => {
	    try {
	        const cliente = JSON.parse(event.body);
	        
//*---- Arma clave de búsqueda

         /*---- Recuperar el cliente desde la base ----*/

          var input = {
               Key: { "id" : {"S" : cliente.id}},
               TableName : "cliente"
          };

          const command = new GetItemCommand(input);
          const response = await ddbClient.send(command);
          const uresponse = unmarshall(response.Item);
          return {
                 statusCode: 200,
     	            body: JSON.stringify({ "data" : uresponse , "response" : "OK" }),
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
