import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets'
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class EventbridgeWithLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function which will produce the event
    const produceFn = new lambda.Function(this,'produceFn',{
      functionName: 'Lambda_Event_Producer',
      code: lambda.Code.fromAsset('lambda'),
      handler: 'producer.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })


    // Grant the lambda functions to put custom events to eventBus
    events.EventBus.grantAllPutEvents(produceFn)


    // Lambda function which will consume the event(or the target of event). Following lambda function will trigger when it matches the country(PK)
    const consumerFn = new lambda.Function(this,'ConsumerFn',{
      functionName: 'Lambda_Event_Reciever',
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consumer.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    });


    // The Rule that filters events to match country == "PK" and sends them to CONSUMER lambda
    const PKrule = new events.Rule(this,'orderPkLambda',{
      targets:[new targets.LambdaFunction(consumerFn)],
      description: 'This is custom event rule created by AWS cdk',
      eventPattern:{
        detail:{
          country: ["PK","IN","BN","AU","NZ"] // Consumer(lambda function) will invoke when one of these country will be in payload.
        }
      }
    })
  }
}
