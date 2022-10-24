import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import  * as iam from 'aws-cdk-lib/aws-iam';

export class LambdaWithS3TracingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this,'s3Role',{
      roleName: 's3bucketscustompolicy',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

   role.addToPolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    resources: ['*'],
    actions: ['s3:ListAllMyBuckets'] // right permission
    // actions: ['s3:GetObject'] // deploy by adding wrong permission, just to XRAY(traces) of lambda
   }));

    const lambdas3Tracing = new lambda.Function(this,'lambdas3tracing',{
      code: lambda.Code.fromAsset('lamda'),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      tracing: lambda.Tracing.ACTIVE,
      role: role
    })
    
  }
}
