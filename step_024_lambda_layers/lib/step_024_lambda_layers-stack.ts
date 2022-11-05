import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step024LambdaLayersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer1 = new lambda.LayerVersion(this,'mylayer',{
      code: lambda.Code.fromAsset('lambdaLayer/external'),
      // compatibleRuntimes: [lambda.Runtime.NODEJS_16_X]
    });

    const layer2 = new lambda.LayerVersion(this,'mylayer1',{
      code: lambda.Code.fromAsset('lambdaLayer/internal'),
      // compatibleRuntimes: [lambda.Runtime.NODEJS_16_X]
    })


    const lambdaLayer = new lambda.Function(this,'lambdalayer',{
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      // layers: [layer1] // single layer
      layers: [layer1,layer2] // multiple layers
    });
   
  }
}
