import { DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomInt } from "crypto";

const client = new DynamoDB({region:'us-east-1'});

const random = randomInt(2,2234) * randomInt(1,9);

export async function handler(e:any){
    const input = {
        TableName: process.env.table_name,
        Item: {
                "id": {
                  "S": `${random}`
                },
                "custom_title": {
                  "S": `${e.title}`
                }
            }
        };
    
        try {
        const command = new PutItemCommand(input);
        const putItem = await client.send(command);
        return {
            operation_Accomplished:true,
            data: command?.input?.Item?.custom_title.S
        }
        } catch (error) {
        console.log(error);
        return "Not table found";
    }
}