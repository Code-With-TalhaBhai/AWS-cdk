import * as AWS from 'aws-sdk';
// import * as XRAY from 'aws-xray-sdk-core';
const XRAY = require('aws-xray-sdk-core');
import {APIGatewayEvent} from 'aws-lambda';


const uuidv4 = () => {
    return "xxxx-4xxx-yxxx-".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };


exports.handler = async(event:APIGatewayEvent)=>{
    const segment = XRAY.getSegment();
    const s3 = XRAY.captureAWSClient(new AWS.S3());
    // const s3 = new AWS.S3();

    const id = uuidv4();
    const name = 'talha';
    const company = 'TechZone';



    const subSegment = segment?.addNewSubsegment('IdGenerator');

    subSegment?.addAnnotation('userId',id);
    subSegment?.addAnnotation('name',name);
    subSegment?.addAnnotation('company',company);


    subSegment?.close();


    s3.listBuckets((err:any,data:any)=>{
        if(data){
            console.log(data.Buckets)
        }
        else{
            console.log(err.stack)
        }
    })

    return {
        statusCode: 200,
        body:{
            id,
            name,
            company
        }
    }

}