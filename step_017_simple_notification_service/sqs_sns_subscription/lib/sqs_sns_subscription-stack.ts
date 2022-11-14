import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SqsSnsSubscriptionStacks extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const topic = sns.Topic.fromTopicArn(this,'sqsTopic',"arn:aws:sns:us-east-1:706908112492:LambdaSnsSubscriptionStack-mytopicDA9518A7-CyntDCkURheF");
    const topic = new sns.Topic(this,'mysqstopic',{
      topicName: 'Sqs_Topic'
    });

    // create a queue fr subscription
    const queue = new sqs.Queue(this,"MyQueue");

    // create a dead-letter queue
    const dlQueue = new sqs.Queue(this,'DeadLetterQueue',{
    queueName: 'MySubscription_DLQ',
    retentionPeriod: cdk.Duration.days(14)
  });

    topic.addSubscription(new subscription.SqsSubscription(queue,{
      deadLetterQueue: dlQueue,
      filterPolicy: {
        price: sns.SubscriptionFilter.numericFilter({
          between: {start:100, stop:200},
          greaterThan: 300
        })
      },
    }));



  }
}
