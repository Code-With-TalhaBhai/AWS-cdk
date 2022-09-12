import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
// import {aws_lambda as lambda} from 'aws-cdk-lib'
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_apigateway as apigw } from 'aws-cdk-lib';

export class LambdaFunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const fn = new lambda.Function(this, 'FirstFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset("lambda"),
    });

    const myApi = new apigw.LambdaRestApi(this, 'myapi', {
      handler: fn,
      proxy: false
    });    

    const items = myApi.root.addResource('banda');
    items.addMethod('GET');  // GET /items


    const items2 = myApi.root.addResource('muqaddar');
    items2.addMethod('GET');  // GET /items

    // example resource
    // const queue = new sqs.Queue(this, 'LambdaFunctionsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
