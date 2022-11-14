import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EmailSnsSubscriptionStack } from '../lib/email_sns_subscription-stack';
import * as sns from 'aws-cdk-lib/aws-sns';


const app = new cdk.App();
new EmailSnsSubscriptionStack(app, 'EmailSnsSubscriptionStack', {
  
  const topic = sns.Topic.fromTopicArn(this,'',"arn:aws:sns:us-east-1:706908112492:Sqs_Topic");

});