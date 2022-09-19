import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step012GrantIamPoliciesToResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this,'myIAMapi',{
      name: 'IamApi',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
        defaultAuthorization:{
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig:{
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      },
      xrayEnabled: true
    });


    // Add DynamoDB table
    const dynamoDbTable = new dynamo.Table(this,'Table',{
      tableName: 'IamTable',
      partitionKey:{
        name: 'id',
        type: dynamo.AttributeType.STRING
      }
    })

    // Create Specific Role for Lambda Function
    const role = new Role(this,'MyFirstCustomRole',{
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    });


    // Attaching dynamoDb Access to policy
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      // resources: ['*'],
      resources: ['arn:aws:dynamodb:us-east-1:706908112492:table/IamTable'],
      actions: ['dynamodb:*','logs:*']
    })


    // Granting IAM permissions to role
      role.addToPolicy(policy);
    

    new cdk.CfnOutput(this,'GraphqlGraphqlKey',{
      value: api.graphqlUrl
    })


    new cdk.CfnOutput(this,'GraphqlApiKey',{
      value: api.apiKey || ''
    });


    // Add Lambda Function
    const IamLambda = new lambda.Function(this,'IamFunction',{
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      role: role, // Defining role to Lambda
      environment: {  // Setting Environment
        "Product_Var": dynamoDbTable.tableName,
      }
    });

    // Add Lambda DataSource
    const lambda_data_source = api.addLambdaDataSource('LambdaDataSource',IamLambda);

    lambda_data_source.createResolver({
      typeName: 'Query',
      fieldName: 'getData'
    });

    lambda_data_source.createResolver({
      typeName: 'Mutation',
      fieldName: 'postData'
    })

    // IamLambda.addEnvironment('Product_Var',dynamoDbTable.tableName);

    // });
  }
}
