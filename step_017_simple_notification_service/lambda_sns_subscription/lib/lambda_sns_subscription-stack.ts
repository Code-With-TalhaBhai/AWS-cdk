import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import { Subscription } from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions'
import * as sqs from 'aws-cdk-lib/aws-sqs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaSnsSubscriptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFn = new lambda.Function(this,'forSNSfunction',{
      functionName: 'SnS_Lambda',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    })

    // Import Existing Topic
    // const topic = sns.Topic.fromTopicArn(this,'topic',"arn:aws:sns:us-east-1:706908112492:ConsoleTopic");


    // Create New Topic
    const topic = new sns.Topic(this,'mytopic',{
      displayName: 'Talha Topic'
    });


    topic.addSubscription(new subscription.LambdaSubscription(lambdaFn));
    
    
  }
}
