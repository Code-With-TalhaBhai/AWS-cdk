import {docClient} from './index';
import { movie } from './type';


async function addDemo(movie:movie){
    const params = {
        TableName : process.env.Movies_Var || '',
        Item: movie
    }

    await docClient.put(params).promise()
    return movie;
}



export default addDemo;