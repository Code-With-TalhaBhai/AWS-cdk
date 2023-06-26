import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FunctionEventType } from 'aws-cdk-lib/aws-cloudfront';


export class Step025LambdaEdgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this,'cfn-bucket',{
      bucketName: 'cdn-cfn-bucket'
    });

    const lambdaFn = new lambda.Function(this,'ed-lamb',{
      functionName: 'edge-lambda',
       runtime: lambda.Runtime.NODEJS_18_X,
       code: lambda.Code.fromInline("()=>{return 'Inline Edge Lambda'}"),
       handler: 'index.edge-lambda'
    })

    
    const distribution = new cloudfront.Distribution(this,'cdn-bucket-distribution',{
      defaultBehavior: {origin: new origins.S3Origin(bucket),
        edgeLambdas:[
          {
            functionVersion: lambdaFn.currentVersion,
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST
          }
        ]
      },
    })




  }
}
