import {docClient} from './index';
import { movie } from './type';


async function demobyId(id:string){
    const params = {
        TableName : process.env.Movies_Var || '',
        Key: {id: id}
    }

    const {Item} = await docClient.get(params).promise()
    return Item;
}



export default demobyId;