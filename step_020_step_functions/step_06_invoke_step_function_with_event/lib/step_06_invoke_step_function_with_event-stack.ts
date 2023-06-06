import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Chain, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import * as step_functions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';



export class Step06InvokeStepFunctionWithEventStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this,'lambda-event',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'event.handler',
      code: lambda.Code.fromAsset('lambda')
    });


    const role = new iam.Role(this,'my-dynamo-event',{
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })


    role.addToPolicy(new PolicyStatement({
      resources: ['arn:aws:dynamodb:us-east-1:706908112492:table/My_Notes'],
      actions: ["dynamodb:*","logs:*"]
    }))


    const fn1 = new lambda.Function(this,'lambda-event1',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dynamo.handler',
      code: lambda.Code.fromAsset('lambda1'),
      environment: {tableName:'My_Notes'},
      role: role
    });


    const api = new apigateway.LambdaRestApi(this,'event-api',{
        handler: fn,
        proxy: false
    });
    

    const items = api.root.addResource('items');
    items.addMethod('POST');

    events.EventBus.grantAllPutEvents(fn);
    
    const event_rule = new events.Rule(this,'apigate-rule',{
      eventPattern:{
        source: ['aws_apigateway'],
        detailType: ['step_functions_gateway'],
        detail: {name:['apigateway_detail','MyOwnApiGateway']},
      }
    });


    const tablefromArn = dynamodb.Table.fromTableArn(this,'my_notes_table',
     'arn:aws:dynamodb:us-east-1:706908112492:table/My_Notes'
    );

    const st_1 = new tasks.DynamoPutItem(this,'dynamoput',{
      table: tablefromArn,
      item: {
        id: tasks.DynamoAttributeValue.fromString('1'),
        title: tasks.DynamoAttributeValue.fromString('It is added by step_functions')
      },
      resultPath: '$.Item'
    });


    const st_2 = new tasks.SqsSendMessage();


    // tablefromArn.grantFullAccess(fn1);

    const chain = step_functions.Chain.start(st_1);

    const state_machine = new StateMachine(this,'event-step',{
      definition: chain
    });

    event_rule.addTarget(new targets.SfnStateMachine(state_machine));

  }
}
