import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';
// import {DynamoEventSource} from 'aws-cdk-lib/aws-lambda-event-sources';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import { S3 } from 'aws-cdk-lib/aws-ses-actions';


export class Step028DynamodbStreamsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   const streamTable = new dynamodb.Table(this,'Stream-Table',{
    tableName: 'Stream_Table',
    partitionKey: {name:'id',type:dynamodb.AttributeType.STRING},
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    stream: dynamodb.StreamViewType.NEW_IMAGE
   });

   const lambdaFn = new lambda.Function(this,'lambda-dynamo-stream',{
      "runtime": lambda.Runtime.NODEJS_18_X,
      "handler": "index.handler",
      "code": lambda.Code.fromInline("exports.handler=(event,context)=>{console.log('All events: ',event, 'dynamo_custom: ',event.Records.map(item=>item.dynamodb),'dynamo_value: ',event.Records.map(item=>Object.entries(item.dynamodb.NewImage)))}"),
   });

   const dlq = new sqs.Queue(this,'dynamo-dead-queue',{
      queueName: 'Dynamo-Deadletter-Queue'
   });


   lambdaFn.addEventSource(new lambdaEventSources.DynamoEventSource(streamTable,{
      retryAttempts: 3,
      batchSize: 2,
      startingPosition: lambda.StartingPosition.LATEST,
      onFailure: new SqsDlq(dlq),
      bisectBatchOnError: true,
   }));

  }
}
