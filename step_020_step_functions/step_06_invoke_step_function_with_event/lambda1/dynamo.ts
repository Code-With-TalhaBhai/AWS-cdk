import { DynamoDBClient,PutItemCommand } from "@aws-sdk/client-dynamodb";

type addElementType = {
    $metadata : {
        httpStatusCode? : number
    }
}


async function addElement(tableName:string | undefined):Promise<addElementType>{
    const client = new DynamoDBClient({});

    const input = {
        TableName: tableName,
        Item:{
                "id":{
                    "S": "1"
                },
                "title":{
                    "S": "This is title from step_functions"
                }
            }
        }

    const command = new PutItemCommand(input);
    try {
      const results = await client.send(command);
      console.log('res: ',results);
        return results;
    } catch (err) {
      console.error('error: ',err);
        return err as addElementType;
    }
}


export async function handler(e:string){
    const response = await addElement(process.env.tableName);
    if(response?.$metadata?.httpStatusCode == 200){
        return "New Element added"
    }
    else{
        return "Element Not Added"
    }
    // return "Event1 is working fine"
}