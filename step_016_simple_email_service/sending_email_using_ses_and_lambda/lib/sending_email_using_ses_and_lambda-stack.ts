import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ApiGw from 'aws-cdk-lib/aws-apigateway';


export class SendingEmailUsingSesAndLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const role = new iam.Role(this,'SesSendEmail',{
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ses:SendEmail','ses:SendRawEmail','ses:SendBounce','logs:*']
    }))


    const lambdaEmail = new lambda.Function(this,'lambdaEmail',{
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      role
    });
    
    const api = new ApiGw.RestApi(this,'sendemails');

    api.root.addMethod('POST',new ApiGw.LambdaIntegration(lambdaEmail));


    new cdk.CfnOutput(this,'apiLambda',{
      value: api.url
    })

  }
}
