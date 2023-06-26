import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';



export class Step00LambdaContainerWithLocalImageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



      const lambdaFn = new lambda.DockerImageFunction(this,'lambda-docker',{
        // Make sure "lambda-Image" folder must contain Dockerfile
        code: lambda.DockerImageCode.fromImageAsset('lambda-Image')
      });   

  }
}
