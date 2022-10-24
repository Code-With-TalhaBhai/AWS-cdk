import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as timestream from 'aws-cdk-lib/aws-timestream';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class Step022AwsTimestreamAndVisualizationWithGrafanaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const aws_timestream_db = new timestream.CfnDatabase(this,'FirstDb',{
      databaseName: 'CustomFirstDb'
    });


    const aws_timestream_table = new timestream.CfnTable(this,'FirstTable',{
      databaseName: aws_timestream_db.databaseName!,
      tableName: 'CustomTable'
    });

    const lambdaFnTimeStream = new lambda.Function(this,'TimeStreamDbFn',{
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'db.handler',
    });


    lambdaFnTimeStream.addEnvironment('Db_Name',aws_timestream_db.databaseName!);
    lambdaFnTimeStream.addEnvironment('Table_Name',aws_timestream_table.tableName!);


    const PostStepIntegration =  new apigateway.LambdaIntegration(lambdaFnTimeStream);

    const api = new apigateway.RestApi(this,'CustomRestApi',{
      restApiName: 'CustomApi',
      description: 'Testing Custom Api'
    });

    api.root.addMethod('POST',PostStepIntegration);

    const policy = new iam.PolicyStatement();

    policy.addActions(
      'timestream:DescribeEndPoints',
      'timestream:WriteRecords'
    );

    policy.addResources('*');

    lambdaFnTimeStream.addToRolePolicy(policy);
    
  }
}
