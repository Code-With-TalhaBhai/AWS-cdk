import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import * as destinations from 'aws-cdk-lib/aws-lambda-destinations';
import * as events from 'aws-cdk-lib/aws-events'
import { EmailSubscription, LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as targets from 'aws-cdk-lib/aws-events-targets';



export class LambdaDestinationWithEventbridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const bus = events.EventBus.fromEventBusArn(this,'For lambda Dest'
    ,'arn:aws:events:us-east-1:706908112492:event-bus/default')


    const destFn = new lambda.Function(this,'dest-fn-event',{
      functionName: 'lambda-event-dest-fn',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dest.handler',
      code: lambda.Code.fromAsset('lambda'),
      onSuccess: new destinations.EventBridgeDestination(bus),
      onFailure: new destinations.EventBridgeDestination(bus)
    })


    const topic = Topic.fromTopicArn(this,'include-event-dest-fn','arn:aws:sns:us-east-1:706908112492:LambdaDestinationWithOtherDestinationsStack-lambdaandsms29A4DC0E-dCjZFiHoO6zV');
    topic.addSubscription(new LambdaSubscription(destFn));
    topic.addSubscription(new EmailSubscription('raizakhalid7@gmail.com'))

    
    const lambdaFn = new lambda.Function(this,'lambda-dest-event',{
      functionName: 'lambda-event-dest-main',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment:{
      topicArn: topic.topicArn
      }
    });

    lambdaFn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'],
        actions: ['sns:*','logs:*']
      })
    );


    const passFn = new lambda.Function(this,'pass-lambda',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'success.handler'
    });


    // eventbridge rules docs
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_destinations-readme.html#invocation-record

    const passRule = new events.Rule(this,'pass-rule',{
      ruleName: 'Destination-pass-rule',
      eventBus: bus,
      eventPattern: {
        "detail":
          {
            "responsePayload":
            {
            "type": ["successful-event"],
            "action": ["success-event-trigger"],
            "data": ["hello-event"]
            }
        }
      }
    })

    passRule.addTarget(new targets.LambdaFunction(passFn));


    const FailFn = new lambda.Function(this,'fail-lambda',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'failure.handler'
    })

    const failRule = new events.Rule(this,'fail-rule',{
      ruleName: 'Destination-fail-rule',
      eventBus: bus,
      eventPattern: {
        "detail": {
          "responsePayload":
            {
            "errorMessage": ["failed-event"],
            "errorType": ["Error"]
            }
        }
      }
    })

    failRule.addTarget(new targets.LambdaFunction(FailFn));

  }
}
