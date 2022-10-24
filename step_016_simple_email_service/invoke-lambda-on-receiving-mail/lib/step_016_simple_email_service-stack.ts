import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step016SimpleEmailServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const lambdaFn = new lambda.Function(this,'mySeSLambda',{
      functionName: 'Ses-lambda',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromInline(`exports.handler = (event)=>{console.log("This is my show. And please, don't show off. Its my time now ==>", JSON.stringify(event)) }`),
      handler: 'index.handler',
    })


    const ruleSet = new ses.ReceiptRuleSet(this,'FirstRuleSet',{
      receiptRuleSetName: 'MyFirstRuleSet'
  });


  // creating instance for taking email input while deployment
    // ref https://docs.aws.amazon.com/cdk/latest/guide/parameters.html
  const emailAddress = new cdk.CfnParameter(this,'emailParam',{
    type: "String", description: 'This is test email description from receipent'
  })

    const sesRule = ruleSet.addRule('AwsRule',{
      // recipients: ['talhakhalid411@gmail.com'],
      recipients: [emailAddress.valueAsString],
      actions:[
        new sesActions.Lambda({
          function: lambdaFn,
          invocationType: sesActions.LambdaInvocationType.EVENT,
        })
      ],
      scanEnabled: true
    })

    // example resource
    // const queue = new sqs.Queue(this, 'Step016SimpleEmailServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
