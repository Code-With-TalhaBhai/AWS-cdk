import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class StaticWebsite02Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a bucket to upload your website files
    const webBucket = new s3.Bucket(this, 'WebsiteBucket', {
      // websiteIndexDocument: 'index.html',
      versioned: true,
      publicReadAccess: true,
    });


    // create a cdn to deploy your website
    const distribution = new cloudfront.Distribution(this, 'myDist', {
    defaultBehavior: { origin: new origins.S3Origin(webBucket) },
    defaultRootObject: 'index.html'
    });


    // prints out the webEndpoint to the terminal

    new cdk.CfnOutput(this,'distributionDomainName',{
      value: distribution.domainName
    })



    // housekeeping for uploading data in bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./myWeb/')],
      destinationBucket: webBucket,
      destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
      distribution: distribution
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'StaticWebsite02Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
