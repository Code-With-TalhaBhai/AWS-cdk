import {docClient} from './index';
import { movie } from './type';

type Params = {
    TableName: string,
    Key: {},
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    UpdateExpression: string,
    ReturnValues: string
  }


async function editDemo(movie:any){
    let params : Params = {
        TableName: process.env.Movies_Var || '',
        Key: {
          id: movie.id
        },
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        UpdateExpression: "",
        ReturnValues: "UPDATED_NEW"
      };
      let prefix = "set ";
      let attributes = Object.keys(movie);
      for (let i=0; i<attributes.length; i++) {
        let attribute = attributes[i];
        if (attribute !== "id") {
          params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
          params["ExpressionAttributeValues"][":" + attribute] = movie[attribute];
          params["ExpressionAttributeNames"]["#" + attribute] = attribute;
          prefix = ", ";
        }
    }
    await docClient.update(params).promise()
    return movie;
}



export default editDemo;