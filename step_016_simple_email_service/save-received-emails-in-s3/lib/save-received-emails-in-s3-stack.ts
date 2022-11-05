import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions';
import * as iam from 'aws-cdk-lib/aws-iam';


export class SaveReceivedEmailsInS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // const bucket = s3.Bucket.fromBucketArn(this,'bucketfromarn','arn:aws:s3:::emailcollectingbucket');
    const bucket = new s3.Bucket(this,'sesbucket')


    const role = new iam.Role(this,'sesRole',{
      assumedBy: new iam.ServicePrincipal('ses.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      resources: [bucket.bucketArn],
      actions: ['s3:*']
    }))


    const Rules = new ses.ReceiptRuleSet(this,'emailsavetos3',{
      receiptRuleSetName: 'SaveEmailstos3',
      rules:[
        {
          recipients: ['info@realdover.com'],
          actions:[
            new sesActions.S3({
            bucket,
            objectKeyPrefix: 'emails/',
            })
          ]
        }
      ]
    })
    

  }
}
