import * as crypto from "crypto";
import {EventBridge, PutEventsCommand} from '@aws-sdk/client-eventbridge'

type appsync = {
    info:{
        fieldName: string;
    }
    arguments:{
        Sort_Key: number,
        Description: string;
        Main_Key: string
    }
}

async function helper(fieldName:string){
    const bridge = new EventBridge({region:'us-east-1'});

    const params = { 
        Entries: [{
                    EventBusName: "Event-AppSync",
                    Source: "my-appsync-event",
                    DetailType: "capturing appsync events",
                    Detail: JSON.stringify({"fieldName": `${fieldName}`})
                }]
        }
        
    // return await bridge.putEvents(params);
    // const command = new PutEventsCommand(params);
    // const response = await comm

    const command = new PutEventsCommand(params);
    const response = await bridge.send(command);
    return response;
}


const arr = [
    {
        Main_Key: '1',
        Sort_Key:2000,
        Description:'This is first description'
    },
    {
        Main_Key: '2',
        Sort_Key: 2015,
        Description: 'This is third description'
    },
    {
        Main_Key: '3',
        Sort_Key: 2016,
        Description: 'This is second description'
    }
]


export async function handler(e:appsync){
    await helper(e.info.fieldName);
    switch(e.info.fieldName){
        case 'AllItems':
            return arr;
        case 'SingleItem':
            return arr.find(data => data.Sort_Key === e.arguments.Sort_Key);
        default:
            return 'not found';
    }
}