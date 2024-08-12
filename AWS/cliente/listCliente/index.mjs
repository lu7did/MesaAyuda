import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
       //*------------------------------------------------------------------------------*
        //* listarTicket
        //* API para listar ticket en base de datos
        //*
        //* Dr. Pedro E. Colla
        //* UADER - Ingeniería de Software I
        //* (c) 2023 Dr. Pedro E. Colla
        //*-----------------------------------------------------------------------------*

//*---- Importa librerias

import { ScanCommand } from "@aws-sdk/client-dynamodb";
import {marshall,unmarshall}  from "@aws-sdk/util-dynamodb";

//*---- Crea cliente DynamoDB (no es tipo DynamoDBClient)

const client = new DynamoDBClient({});

//*---- Entry point del evento
export const handler = async (event, context) => {
	    try {

//*---- Extrae data del ticket para buscar, principalmente clienteID el que es usado como clave

	        const ticket = JSON.parse(event.body);
	        
//*---- Arma clave de búsqueda

                      const input = { // ScanInput
                            TableName: "cliente", // required
                            Select: "SPECIFIC_ATTRIBUTES",
                            AttributesToGet: 
					['id','nombre','contacto','activo','baja','registrado','fecha_alta','fecha_ultimo_ingreso'],
                            }
                          
                          

//*---- Realiza la busqueda

	          const command = new ScanCommand(input);
            const response = await client.send(command);

//*---- Hace el unmarshalling de los datos pues NO es un objeto DynamoDBDocumentClient y por lo tanto el resultado es un JSON que  
tiene el type

            const uresponse=response.Items.map(i=>unmarshall(i));
            
//*---- Si anda bien retorna

	          return {
	            statusCode: 200,
	            body: JSON.stringify(uresponse),
	        };
	    }

//*----- Si algo anda mal retorna el error

	    catch (error) {
	        console.error(error);
	        return {
	            statusCode: 500,
	            body: JSON.stringify({ message: error.message }),
	        };
	    }
	};


