       //*------------------------------------------------------------------------------*
        //* crearTicket
        //* API para crear ticket en base de datos
        //* Implementa políticas de asignación de ticket id y fecha de ultimo contacto
        //*
        //* Dr. Pedro E. Colla
        //* UADER - Ingeniería de Software I
        //* (c) 2023 Dr. Pedro E. Colla
        //*-----------------------------------------------------------------------------*

                
        //*---------------------------------------------*
        //* Importa librerias del ambiente AWS Node.JS  *
        //*---------------------------------------------*
                    
        import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
        import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
        import { randomUUID } from "crypto";
                
        //*---------------------------------------------*
        //* Define objeto de dynamo DB                  *
        //*---------------------------------------------*
        const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
                    
        //*---------------------------------------------*
        //* Entry point del evento                      *
        //*---------------------------------------------*
        export const handler = async (event, context) => {
            try {
        
                //*----- Parsea JSON de entrada
        
                const ticket = JSON.parse(event.body);

                //*----- Obtiene objeto fecha y establece fecha de ultimo contacto como ahora

                var hoy = new Date();
                      var dd = String(hoy.getDate()).padStart(2, '0');
                      var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
                      var yyyy = hoy.getFullYear();
                      hoy = dd + '/' + mm + '/' + yyyy;
                ticket.ultimo_contacto=hoy;

                if (ticket.estado_solucion < 1 || ticket.estado_solucion > 4) {
                   ticket.estado_solucion = 1;
                }

                //*------ Genera nuevo objeto ticket, el id es asignado automáticamente
                
                const newTicket = { 
                    ...ticket,
                    id: randomUUID(),
                };
          
                //*------ Inserta fila en el data base (nunca dará duplicado)
        
                await ddbDocClient.send(new PutCommand({ 
                    TableName: "ticket",
                    Item: newTicket,
                }));
                
                //*------- Si la inserción fue exitosa retorna 200 y datos del ticket generado
                
                return {
                    statusCode: 200,
                    body: JSON.stringify(newTicket),
                };    
            }   
                      
                //*------- Si hubo error en alguna operación retorna el error
                
            catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: error.message }),
                };
            }
        };
                
        //*---------------------------------------------*
        //* Fin del objeto crearTicket API AWS Node.JS  *
        //*---------------------------------------------*



