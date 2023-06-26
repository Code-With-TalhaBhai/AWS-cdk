import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import * as destinations from 'aws-cdk-lib/aws-lambda-destinations'
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions'
import * as iam from 'aws-cdk-lib/aws-iam';


export class LambdaDestinationWithOtherDestinationsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new Topic(this,'destination');

    const lambda_topic = new Topic(this,'lambda_and_sms');    
    
    const FailFn = new lambda.Function(this,'fail-fn',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'fail.handler'
    })

    topic.addSubscription(new subscriptions.EmailSubscription('raizakhalid7@gmail.com'));
    
    const destinationFn = new lambda.Function(this,'dest-fn',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'destined.handler',
      code: lambda.Code.fromAsset('lambda'),
      retryAttempts: 1,
      onSuccess: new destinations.SnsDestination(topic),
      onFailure: new destinations.LambdaDestination(FailFn)
    });

    // Send message to new_number
    lambda_topic.addSubscription(new subscriptions.SmsSubscription('+923274653182'));
    // Invoke destination lambda
    lambda_topic.addSubscription(new subscriptions.LambdaSubscription(destinationFn));


    const lambdaFn = new lambda.Function(this,'lambda-dest',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'main.handler',
      environment: {
        topicArn: lambda_topic.topicArn
      }
    });

    lambdaFn.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'], // cloudwatch.amazonaws.com
      actions: ['sns:*','logs:*']
    }))

    
  }
}
