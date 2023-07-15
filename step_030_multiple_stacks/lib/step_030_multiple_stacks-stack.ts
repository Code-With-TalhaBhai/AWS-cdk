import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3_deployments from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';


export class frontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);   

    const bucket = new s3.Bucket(this,'frontendstack',{
      websiteIndexDocument: 'index.html',
    });


    bucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      actions: ["*"]
    }));

    // For Private Asset Deployment
    // const bucket_assets = new s3_assets.Asset(this,'s3-frontend-asset',{
    //   path: "my_frontend"
    // });

    const distribution = new cloudfront.Distribution(this,'cfn-multi-distribution',{
      defaultBehavior: {
        origin: new origins.S3Origin(bucket)
      },
      defaultRootObject: 'index.html'
    })


    // For Public Deployment
    new s3_deployments.BucketDeployment(this,'frontend-s3',{
      sources: [s3_deployments.Source.asset('./my_frontend')],
      destinationBucket: bucket,
      distribution
    });

    new cdk.CfnOutput(this,'distributionDomainName',{
      value: distribution.domainName
    })

  }
}


export class backendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope,id,props);

    const lambdaFn = new lambda.Function(this,'backend-lambda',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'backend.handler',
      code: lambda.Code.fromAsset('my_backend')
    })


  }
}

