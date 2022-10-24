import * as AWS from 'aws-sdk';
const XRAY = require('aws-xray-sdk-core');
// import * as XRAY from 'aws-xray-sdk-core';
import {APIGatewayEvent} from 'aws-lambda';

exports.handler = (event:APIGatewayEvent)=>{


    const s3 = XRAY.captureAWSClient(new AWS.S3());
    // const s3 = new AWS.S3();


    // this function will list all s3 buckets
    s3.listBuckets((err:any,data:any)=>{
        if(err){
         console.log(err)
        }
        else{
            console.log(data)
        }
    })
}