import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step004GraphqlDynamodbAsDatasourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this,'myDynamoApi',{
      name: 'aws-lambda-dynamo',
      schema: appsync.Schema.fromAsset('schema/graphql.gql'),
      authorizationConfig:{
        defaultAuthorization:{
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig:{
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      },
      xrayEnabled: true,
    });



    const lambdaFunc = new lambda.Function(this,'AppsyncLambdaDynamo',{
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    });


    const lambdaSource = api.addLambdaDataSource('lambdaSource',lambdaFunc);


    new cdk.CfnOutput(this,'graphqlApiKey',{
      value: api.graphqlUrl
    })

    new cdk.CfnOutput(this,'graphqlKey',{
      value: api.apiKey || '',
    })

    new cdk.CfnOutput(this,'Stack Region',{
      value: this.region
    })


    
    
    lambdaSource.createResolver({
      typeName: "Query",
      fieldName: "getDemos"
    });


    lambdaSource.createResolver({
      typeName: "Mutation",
      fieldName: "getDemoById"
    });
    

    lambdaSource.createResolver({
      typeName: "Mutation",
      fieldName: "addDemo"
    });
    

    lambdaSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateDemo"
    });


    lambdaSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteDemo"
    });



    // DynamoDb Table
    const table = new dynamo.Table(this, 'Table', {
      tableName: 'My_Movies',
      partitionKey: { name: 'id', type: dynamo.AttributeType.STRING },
    });
    
    table.grantFullAccess(lambdaFunc);
    lambdaFunc.addEnvironment('Movies_Var',table.tableName);
  }
}
