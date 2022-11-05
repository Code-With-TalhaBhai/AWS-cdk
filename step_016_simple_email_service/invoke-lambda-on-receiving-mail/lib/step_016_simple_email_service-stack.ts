import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step016ASimpleEmailServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const role = new iam.Role(this,'mylambrole',{
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['lambda:*','lambda:logs'],
    }))

    const lambdaFn = new lambda.Function(this,'SeSLambda',{
      functionName: 'Ses-lambda1',
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromInline(`exports.handler = (event)=>{console.log("This is my show. NEVER GIVE UP MAN, GET UP, GET UP AND GET UP. And please, don't show off. Its my time now ==>", JSON.stringify(event)) }`),
      handler: 'index.handler',
      tracing: lambda.Tracing.ACTIVE,
      role:role
    });


    const ruleSet = new ses.ReceiptRuleSet(this,'SecondRuleSet',{
      receiptRuleSetName: 'MySecondRuleSet'
  });

  
  // creating instance for taking email input while deployment
    // ref https://docs.aws.amazon.com/cdk/latest/guide/parameters.html

  // const emailAddress = new cdk.CfnParameter(this,'emailParam',{
  //   type: "String", description: 'This is test email description from receipent'
  // })

    const sesRule = ruleSet.addRule('AwsRules',{
      recipients: ['info@realdover.com'],
      // recipients: [emailAddress.valueAsString],
      actions:[
        new sesActions.Lambda({
          function: lambdaFn,
          invocationType: sesActions.LambdaInvocationType.EVENT,
        })
      ],
      scanEnabled: true
    });

    sesRule.addAction

    // example resource
    // const queue = new sqs.Queue(this, 'Step016SimpleEmailServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
