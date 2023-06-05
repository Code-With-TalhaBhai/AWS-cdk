import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync'
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as events from 'aws-cdk-lib/aws-events'
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class EventsFromAppsyncStack1 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this,'event_grap',{
      name: 'event_grap',
      schema: appsync.SchemaFile.fromAsset('schema/events.graphql'),
      xrayEnabled: true,
      authorizationConfig:{
        defaultAuthorization:{
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });

    new cdk.CfnOutput(this,'output-api',{
      value: api.graphqlUrl
    });

    // const dynamo = new dynamodb.Table(this,'dynamo-event',{
    //   tableName: 'Dynamodb-Event',
    //   partitionKey: {
    //     'name': 'Main_Key',
    //     'type': dynamodb.AttributeType.STRING
    //   },
    //   billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    // });

    // const dynamo_api = api.addDynamoDbDataSource('dynamo-source-event',dynamo);

    // dynamo_api.createResolver('QueryAllItems',{
    //   typeName: 'Query',
    //   fieldName: 'AllItems',
    //   requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
    //   responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    // })

    // dynamo_api.createResolver('QuerySingleItem',{
    //   typeName: 'Query',
    //   fieldName: 'SingleItem',
    //   requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem('Main_Key','Main_Key'),
    //   responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    // })

    // dynamo_api.createResolver('MutateItem',{
    //   typeName: 'Mutation',
    //   fieldName: 'PostItem',
    //   requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
    //     appsync.PrimaryKey.partition('Main_Key').auto(), // Assign Random Id
    //     appsync.Values.projecting('') // Assign data other than partition key
    //   ),
    //   responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    // });

    // dynamo_api.createResolver('DeleteItemResolver',{
    //   typeName: 'Mutation',
    //   fieldName: 'DeleteItem',
    //   requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('Main_Key','Main_Key'),
    //   responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    // });

    // dynamo_api.createResolver('UpdateItemResolver',{
    //   typeName: 'Mutation',
    //   fieldName: 'UpdateItem',
    //   requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
    //     appsync.PrimaryKey.partition('Main_Key').is('Main_Key'),
    //     appsync.Values.projecting()
    //   ),
    //   responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    // });


    const my_lambda = new lambda.Function(this,'appsync-lamb',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'appsync.handler',
      code: lambda.Code.fromAsset('lambda')
    })

    const lambda_soruce = api.addLambdaDataSource('lambda-appsync',my_lambda)

    lambda_soruce.createResolver('AllItems',{
      typeName: "Query",
      fieldName: "AllItems"
    });

    lambda_soruce.createResolver('SingleItem',{
      typeName: "Query",
      fieldName: "SingleItem"
    });

    lambda_soruce.createResolver('DeleteItem',{
      typeName: "Mutation",
      fieldName: "DeleteItem"
    });

    lambda_soruce.createResolver('PostItem',{
      typeName: "Mutation",
      fieldName: "PostItem"
    });

    lambda_soruce.createResolver('UpdateItem',{
      typeName: "Mutation",
      fieldName: "UpdateItem"
    });

    
    const my_lambda1 = new lambda.Function(this,'lambda1_event',{
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda1'),
      handler: 'consumer.handler'
    });


    const bus =  new EventBus(this,'bus',{
      eventBusName: 'Event-AppSync',
    });

    events.EventBus.grantAllPutEvents(my_lambda);

    // bus.grantPutEventsTo(my_lambda);

    const rule = new events.Rule(this,'appsync-rule',{
      ruleName: 'MyAppsync-Rule',
      eventBus: bus,
      eventPattern: {
        source: ['my-appsync-event'],
        detailType: ['capturing appsync events'],
        detail: 
          {
            fieldName: ['AllItems','SingleItem','PostItem','DeleteItem','UpdateItem']
          },
      },
      // targets: new targets.LambdaFunction(my_lambda)
    });

    rule.addTarget(new targets.LambdaFunction(my_lambda1));

  }
}
