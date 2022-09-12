import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step008AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this,'with only dynamodb datasource',{
      name: "ApiWithoutlambdaOnlyDynamo",
      schema: appsync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig:{
        defaultAuthorization:{
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig:{
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      },
      xrayEnabled: true
    });

    const ddbTable = new ddb.Table(this,'tableFunction',{
      tableName: 'My_Notes',
      partitionKey:{
        name: 'id',
        type: ddb.AttributeType.STRING
        }
      })

      const dynamo_data_source = api.addDynamoDbDataSource('DynomoDirectDataSource',ddbTable);


      // Add Note
      dynamo_data_source.createResolver({
        typeName: 'Mutation',
        fieldName: 'createNote',
        requestMappingTemplate:  appsync.MappingTemplate.dynamoDbPutItem(
          appsync.PrimaryKey.partition('id').auto(),
          appsync.Values.projecting()
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
      })

      // GetNote by Id
      dynamo_data_source.createResolver({
        typeName: 'Query',
        fieldName: 'noteById',
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem(
        'id','id'
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
      })

      // Edit Note
      dynamo_data_source.createResolver({
        typeName: 'Mutation',
        fieldName: 'updateNote',
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
          appsync.PrimaryKey.partition('id').is('id'),
          appsync.Values.projecting()
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
      })

      // Fetch All Notes
      dynamo_data_source.createResolver({
        typeName: 'Query',
        fieldName: 'notes',
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
      })

      // Delete Note
      dynamo_data_source.createResolver({
        typeName: 'Mutation',
        fieldName: 'deleteNote',
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem(
          'id','id'
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
      })

      // Read with Consistency
      // dynamo_data_source.createResolver({
      //   typeName: 'Query',
      //   fieldName: 'notes',
      //   requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(true),
      //   responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
      // })
  }
}


