import {docClient} from './index';
import { movie } from './type';


async function AllDemos(){

    const doc = await docClient.scan({TableName:process.env.Movies_Var || ''}).promise()
    return doc.Items;
}



export default AllDemos;