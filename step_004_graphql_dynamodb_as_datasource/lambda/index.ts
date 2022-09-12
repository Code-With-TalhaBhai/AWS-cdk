import {DynamoDB} from 'aws-sdk';
import addDemo from './functions/addDemo';
import AllDemos from './functions/AllDemos';
import deleteDemo from './functions/DeleteDemo';
import editDemo from './functions/editDemo';
import demobyId from './functions/getDemoById';
import { movie } from './functions/type';


const docClient = new DynamoDB.DocumentClient();



type AppSyncEvent = {
    info:{
        fieldName: string
    },
    arguments:{
        id: string;
        input: movie;
        DemoInput: demo;
    }
}

// type movie = {
//     id: string;
//     version: string;
// }

type demo = {
    version: string;
}

exports.handler = async(event:AppSyncEvent)=>{

    switch(event.info.fieldName){
            case 'addDemo':
                return await addDemo({id:`key-${Math.random()}`,version:event.arguments.DemoInput.version})

            case 'getDemoById':
                return demobyId(event.arguments.id);

            case 'updateDemo':
                return editDemo(event.arguments.input);

            case 'getDemos':
                return await AllDemos();
            
            case 'deleteDemo':
                    return deleteDemo(event.arguments.id);
            default:
                return "not Found"
    }    
}