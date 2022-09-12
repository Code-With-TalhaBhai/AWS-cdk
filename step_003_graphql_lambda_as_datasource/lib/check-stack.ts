import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda'


export class CheckStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'first',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
      xrayEnabled: true,
    });

    const myLambda = new lambda.Function(this,'MyLambdaFunction',{
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'welcome.handler'
    })

    const myDataSource = api.addLambdaDataSource('myLambdaDataSource',myLambda);

    myDataSource.createResolver({
      typeName: "Query",
      fieldName: "welcome"
    })

    myDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getDemos'
    })

    myDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addDemo'
    })


    new cdk.CfnOutput(this,'graphqlApiKey',{
      value: api.apiKey || '',
    })

    new cdk.CfnOutput(this,'graphqlApiUrl',{
      value: api.graphqlUrl
    })


    // example resource
    // const queue = new sqs.Queue(this, 'CheckQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
