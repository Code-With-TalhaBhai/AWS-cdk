import {docClient} from './index';



async function deleteDemo(id:string){
    const params = {
        TableName : process.env.Movies_Var || '',
        Key: {id: id}
    }

    await docClient.delete(params).promise()
    return `Item with ${id} has been deprecated`
}



export default deleteDemo;