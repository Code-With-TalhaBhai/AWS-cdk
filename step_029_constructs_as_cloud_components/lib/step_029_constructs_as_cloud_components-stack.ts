import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { constructBucket } from '../constructs/constructBucket';
import * as sns_sub from 'aws-cdk-lib/aws-sns-subscriptions';


export class Step029ConstructsAsCloudComponentsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this,'multi-construct-queue',{
      queueName: 'Multi-Construct-Queue'
    });
 
    const multi_construct = new constructBucket(this,'Multi-Bucket-Construct',{
      prefix: 'images/'
    });

    multi_construct.topic.addSubscription(new sns_sub.SqsSubscription(queue));

   
  }
}
