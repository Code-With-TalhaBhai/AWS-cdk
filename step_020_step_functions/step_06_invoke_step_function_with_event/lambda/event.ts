import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import {EventBridgeClient, PutEventsCommand} from '@aws-sdk/client-eventbridge';

async function fire_event(){
    const bridge_client = new EventBridgeClient({region:'us-east-1'});

    const input = {
        Entries:[
            {
                EventBusName: 'default',
                Source: 'aws_apigateway',
                DetailType: 'step_functions_gateway',
                Detail: JSON.stringify({name:'apigateway_detail'})
            }
        ]
    };

    const command = new PutEventsCommand(input);
    const response = await bridge_client.send(command);
    return response;
}


export async function handler(e:APIGatewayProxyEvent):Promise<APIGatewayProxyResult>{
    await fire_event();
    if(e.requestContext.httpMethod == 'POST'){

        return {
            statusCode: 200,
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({body:e.body})
        };
    }


    else{
        return {
            statusCode: 200,
            headers: {"Content-Type":"application/json"},
            body: 'its not working'
        };
    }
}