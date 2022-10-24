import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CoreConceptsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const role = new iam.Role(this,'mys3custom',{
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['s3:GetObject']
    })

    role.addToPolicy(policy);

    // The code that defines your stack goes here
    const lambda_core = new lambda.Function(this,'lambda_core_trace',{
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      tracing: lambda.Tracing.ACTIVE,
      role: role
    });



    


  }
}
