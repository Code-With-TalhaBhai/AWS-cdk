import {DynamoDB} from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();


type AppSyncEvent = {
    info:{
        fieldName: string
    },
    arguments:{
        id: String;
        name: String;
        product: String;
    }
}

exports.handler = async(event:AppSyncEvent)=>{
    if(event.info.fieldName === 'getData'){
        const doc = await docClient.scan({TableName:process.env.Product_Var || ''}).promise()
       return doc.Items;
    }
    if(event.info.fieldName === 'postData'){
        const params = {
            TableName : process.env.Product_Var || '',
            Item: {id:event.arguments.id, name:event.arguments.name, product:event.arguments.product}
        }
    
        await docClient.put(params).promise()
        return {id:event.arguments.id, name:event.arguments.name, product:event.arguments.product};
    }
    else{
        return '';
    }
}