import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

// Not completed keep working
export class Step028AS3ImgLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFn = new lambda.Function(this,'lambda-s3-img',{
      "runtime": lambda.Runtime.NODEJS_18_X,
      "handler": "index.handler",
      "code": lambda.Code.fromInline("exports.handler=(event,context)=>{console.log('All events: ',event)}"),
   });

  // Trigger lambda when upload img to s3
   const bucket = new Bucket(this,'s3-lamb',{
      bucketName: 's3-img-lambda-invoke',

   });

   lambdaFn.addEventSource(new lambdaEventSources.S3EventSource(bucket,{
      events: [s3.EventType.OBJECT_CREATED,s3.EventType.OBJECT_CREATED_PUT],
      filters: [
         {prefix:'images/',suffix:'.png'},
      ]
   }));

  }
}
